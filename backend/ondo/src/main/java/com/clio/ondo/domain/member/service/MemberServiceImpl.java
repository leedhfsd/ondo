package com.clio.ondo.domain.member.service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import com.clio.ondo.domain.alarm.missionAlarm.model.FCMToken;
import com.clio.ondo.domain.alarm.missionAlarm.service.ScheduledAlarmService;
import com.clio.ondo.domain.image.service.ImageService;
import com.clio.ondo.domain.mission.service.MissionService;
import com.clio.ondo.global.auth.MemberPrincipalDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.character.repository.CharacterRepository;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.model.dto.DeleteRequestDto;
import com.clio.ondo.domain.member.model.dto.JoinRequestDto;
import com.clio.ondo.domain.member.model.dto.LoginRequestDto;
import com.clio.ondo.domain.member.model.dto.UpdateRequestDto;
import com.clio.ondo.domain.member.repository.MemberRepository;
import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.auth.jwtUtil.TokenDto;
import com.clio.ondo.global.exception.member.MemberAlreadyExistsException;
import com.clio.ondo.global.exception.member.MemberException;
import com.clio.ondo.global.exception.member.MemberNotFoundException;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@PropertySource("classpath:s3.properties")
@Slf4j
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;
	private final CharacterRepository characterRepository;
	private final ImageService imageService;
	private final RedisTemplate<String, String> redisTemplate;
	private final JwtTokenProvider jwtTokenProvider;
	private final DaoAuthenticationProvider memberAuthenticationProvider;
	private final PasswordEncoder passwordEncoder;
	private final MissionService missionService;
	private final ScheduledAlarmService scheduledAlarmService;

	@Value("${profile.url}")
	String defaultProfileUrl; //기본 프로필 이미지
	String profileUrl;

	@Override
	@Transactional
	public Long join(JoinRequestDto joinRequestDto) throws IOException {
		Member member = joinRequestDto.toEntity(defaultProfileUrl);
		Optional<Member> memberOptional = memberRepository.findByEmail(member.getEmail());
		if (memberOptional.isPresent()) {
			throw new MemberAlreadyExistsException("회원가입에 실패했습니다.");
		}
		Character character = member.getCharacter();

		characterRepository.save(character);
		memberRepository.save(member);
		missionService.createTodayMission(member.getId());

		Optional<Member> findMemberOptinal = memberRepository.findByEmail(member.getEmail());
		return findMemberOptinal.get().getId();
	}


	@Override
	public Member findOne(Long memberId) {
		Optional<Member> memberOptional = memberRepository.findById(memberId);
		if (memberOptional.isPresent()) {
			return memberOptional.get();
		} else {
			throw new MemberNotFoundException("회원 조회가 실패했습니다.");
		}
	}

	@Override
	public Long findIdByEmail(String email){
		return memberRepository.findIdByEmail(email);
	}

	@Override
	@Transactional
	public TokenDto login(LoginRequestDto loginRequestDto) throws Exception {
		UsernamePasswordAuthenticationToken authToken =
				new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword());
		Authentication authentication = memberAuthenticationProvider.authenticate(authToken);
		String accessToken = jwtTokenProvider.generateAccessToken(authentication);
		String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

		Optional<Member> memberOptional = memberRepository.findByEmail(loginRequestDto.getEmail());
		scheduledAlarmService.saveToken(memberOptional.get().getId(), new FCMToken(loginRequestDto.getFcmtoken()));

		return new TokenDto(accessToken, refreshToken);
	}

	@Override
	@Transactional
	public void logout(String accessToken) throws AuthenticationException {
		Claims accessTokenclaims = jwtTokenProvider.decodeJwt(accessToken);
		if (jwtTokenProvider.validateToken(accessToken)
			&& jwtTokenProvider.hasClaim(accessTokenclaims, "type", "access")) {
			String user = accessTokenclaims.getSubject();
			String refreshToken = redisTemplate.opsForValue().get("refresh-token:" + user);
			if (refreshToken != null) {
				redisTemplate.opsForValue().set(
					"blacklist:" + refreshToken,
					refreshToken,
					jwtTokenProvider.getExpirationTime(refreshToken),
					TimeUnit.MILLISECONDS
				);
			}
			redisTemplate.opsForValue().set(
				"blacklist:" + accessToken,
				accessToken,
				accessTokenclaims.getExpiration().getTime(),
				TimeUnit.MILLISECONDS
			);
		}
	}

	@Override
	@Transactional
	public void deleteMember(DeleteRequestDto deleteRequestDto, String accessToken) {
		Claims claims = jwtTokenProvider.decodeJwt(accessToken);
		String user = claims.getSubject();
		Member findMember = memberRepository.findByEmail(user).orElseThrow(MemberNotFoundException::new);
		if (passwordEncoder.matches(deleteRequestDto.getPassword(), findMember.getPassword())) {
			logout(accessToken);
			if(Objects.equals(findMember.getProfileUrl(), defaultProfileUrl)){
				imageService.delete(findMember.getProfileUrl(),"");
			}else{
				imageService.delete(findMember.getProfileUrl(),"MemberProfile");
			}

			memberRepository.delete(findMember);
		} else {
			throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
		}
	}

	@Override
	@Transactional
	public Long updateMember(UpdateRequestDto updateRequestDto, String accessToken) throws IOException {
		Claims claims = jwtTokenProvider.decodeJwt(accessToken);
		String user = claims.getSubject();
		Member findMember = memberRepository.findByEmail(user).orElseThrow(MemberNotFoundException::new);
		if (StringUtils.hasText(updateRequestDto.getPassword())) {
			updateRequestDto.setPassword(passwordEncoder.encode(updateRequestDto.getPassword()));
			findMember.updatePassword(updateRequestDto.getPassword());
		}
		if (StringUtils.hasText(updateRequestDto.getNickname())) {
			findMember.updateNickName(updateRequestDto.getNickname());
		}
		memberRepository.save(findMember);
		return findMember.getId();
	}

	@Override
	@Transactional
	public String reissueAccessToken(String refreshToken) {
		Claims claims = jwtTokenProvider.decodeJwt(refreshToken);
		String key = "refresh-token:" + claims.getSubject();
		try {
			if (Objects.equals(redisTemplate.opsForValue().get(key), refreshToken)
				&& jwtTokenProvider.isTokenBlacklisted(
				refreshToken)) {
				Long id = claims.get("id", Long.class);
				Member member = findOne(id);
				log.error(member.toString());
				MemberPrincipalDetails userDetails = new MemberPrincipalDetails(member);
				return jwtTokenProvider.generateAccessToken(new UsernamePasswordAuthenticationToken(userDetails, null));
			}
		} catch (MemberException e) {
			throw new MemberException("토큰 재발급을 실패했습니다.");
		}
		return "유효하지 않은 토큰입니다";
	}

	public List<Reservation> getReservationsForMember(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("Member not found"));
		return member.getReservations();
	}
}
