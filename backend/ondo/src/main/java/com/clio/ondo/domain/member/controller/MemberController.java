package com.clio.ondo.domain.member.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.clio.ondo.domain.alarm.missionAlarm.model.FCMToken;
import com.clio.ondo.domain.alarm.missionAlarm.service.ScheduledAlarmService;
import com.clio.ondo.domain.counselor.model.dto.CounselorResponseDto;
import com.clio.ondo.domain.counselor.service.CounselorService;
import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.model.dto.DeleteRequestDto;
import com.clio.ondo.domain.member.model.dto.JoinRequestDto;
import com.clio.ondo.domain.member.model.dto.LoginRequestDto;
import com.clio.ondo.domain.member.model.dto.MemberResponseDto;
import com.clio.ondo.domain.member.model.dto.UpdateRequestDto;
import com.clio.ondo.domain.member.repository.MemberRepository;
import com.clio.ondo.domain.member.service.MemberService;
import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.MemberPrincipalDetails;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.auth.jwtUtil.TokenDto;
import com.clio.ondo.global.exception.member.MemberAlreadyExistsException;
import com.clio.ondo.global.exception.member.MemberException;
import com.clio.ondo.global.exception.member.MemberNotFoundException;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

	private final MemberRepository memberRepository;
	private final MemberService memberService;
	private final CounselorService counselorService;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final ScheduledAlarmService scheduledAlarmService;

	@PostMapping("/login")
	public ResponseEntity<ResponseVO<TokenDto>> login(@RequestBody LoginRequestDto loginRequestdto, HttpServletResponse response) {
		try {
			TokenDto token = memberService.login(loginRequestdto);
			// 쿠키 설정
			Cookie accessTokenCookie = new Cookie("accessToken", token.getAccessToken());
			accessTokenCookie.setHttpOnly(true);
			accessTokenCookie.setPath("/");
			accessTokenCookie.setMaxAge(3600*24*30); // 30 일

			Cookie refreshTokenCookie = new Cookie("refreshToken", token.getRefreshToken());
			refreshTokenCookie.setHttpOnly(true);
			refreshTokenCookie.setPath("/");
			refreshTokenCookie.setMaxAge(7 * 24 * 3600 * 5); // 5 week

			response.addCookie(accessTokenCookie);
			response.addCookie(refreshTokenCookie);

//			Long memberId = memberService.findIdByEmail(loginRequestdto.getEmail());
//			try{
//				scheduledAlarmService.saveToken(memberId, loginRequestdto.getToken());
//			}catch(Exception e){
//				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("로그인 실패 (푸쉬알림불가)"));
//			}

			return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("token", token));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("로그인 실패"));
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<ResponseVO<Void>> logout(HttpServletRequest request,HttpServletResponse response, @RequestBody
		FCMToken fcmToken) {
		try {
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);
			memberService.logout(token);

			Cookie accessTokenCookie = new Cookie("accessToken", null);
			accessTokenCookie.setHttpOnly(true);
			accessTokenCookie.setPath("/");
			accessTokenCookie.setMaxAge(0);

			Cookie refreshTokenCookie = new Cookie("refreshToken", null);
			refreshTokenCookie.setHttpOnly(true);
			refreshTokenCookie.setPath("/");
			refreshTokenCookie.setMaxAge(0);

			// 응답에 쿠키 추가
			response.addCookie(accessTokenCookie);
			// refreshToken 쿠키를 응답에 추가 (현재 주석 처리됨)
			response.addCookie(refreshTokenCookie);

			scheduledAlarmService.deleteToken(id, fcmToken);

			return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("logout"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("로그아웃 실패"));
		}
	}

	@PostMapping("/join")
	public ResponseEntity<ResponseVO<?>> join(@RequestBody JoinRequestDto joinRequestDto){
		try {
			joinRequestDto.setPassword(passwordEncoder.encode(joinRequestDto.getPassword()));
			Long memberId = memberService.join(joinRequestDto);
			return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("Success", "id", memberId));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("회원 가입 실패: 올바른 값을 입력해주세요."));
		} catch (MemberAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("회원 가입 실패: 이미 가입된 회원입니다."));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}


	@GetMapping("/id")
	public ResponseEntity<ResponseVO<Long>> getMyId(HttpServletRequest request) {
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long id = jwtTokenProvider.getIdFromToken(token);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("id", id));
	}

	@GetMapping("/me")
	public ResponseEntity<ResponseVO<MemberResponseDto>> getMyInfo(HttpServletRequest request) {
		try {
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Authentication authentication = jwtTokenProvider.getMemberAuthentication(token);
			MemberPrincipalDetails userDetails = (MemberPrincipalDetails)authentication.getPrincipal();
			Member user = memberRepository.findByEmail(userDetails.getMember().getEmail())
				.orElseThrow(MemberNotFoundException::new);
			MemberResponseDto memberResponseDto = MemberResponseDto.builder()
				.id(user.getId())
				.name(user.getName())
				.nickname(user.getNickname())
				.email(user.getEmail())
				.role(String.valueOf(user.getRole()))
				.profileUrl(user.getProfileUrl())
				.gender(String.valueOf(user.getGender()))
				.birthDate(user.getBirthDate())
				.profileUrl(user.getProfileUrl())
				.build();
			return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("user", memberResponseDto));
		} catch (AuthenticationException | JwtException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("내정보 조회 실패"));
		}
	}

	@PutMapping("/update")
	public ResponseEntity<ResponseVO<?>> update(
		@RequestBody UpdateRequestDto updateRequestDto,
		HttpServletRequest request) {
		Long memberId;
		try {
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			memberId = memberService.updateMember(updateRequestDto, token);
		} catch (MemberNotFoundException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("회원 정보 수정 실패"));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("회원 정보 수정 성공", "id", memberId));
	}

	@DeleteMapping("/delete")
	public ResponseEntity<ResponseVO<String>> delete(@RequestBody DeleteRequestDto deleteRequestDto,
		HttpServletRequest request) {
		try {
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			memberService.deleteMember(deleteRequestDto, token);
		} catch (MemberNotFoundException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("회원 탈퇴 실패"));
		}
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("회원 탈퇴 성공"));
	}

	@PostMapping("/reissue")
	public ResponseEntity<ResponseVO<String>> reissueAccessToken(HttpServletRequest request) {
		try {
			String refreshToken = jwtTokenProvider.getJwtTokenFromCookies(request, "refreshToken");
			String newAccessToken = memberService.reissueAccessToken(refreshToken);
			return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success(newAccessToken));
		} catch (AuthenticationException | MemberException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("토큰 재발급 실패"));
		}
	}

	@GetMapping("/oauth-success")
	public ResponseEntity<ResponseVO<TokenDto>> oauthSuccess(TokenDto token, HttpServletResponse response) {
		Cookie accessTokenCookie = new Cookie("accessToken", token.getAccessToken());
		accessTokenCookie.setHttpOnly(true);
		accessTokenCookie.setPath("/");
		accessTokenCookie.setMaxAge(3600*24*30); // 30 일

		Cookie refreshTokenCookie = new Cookie("refreshToken", token.getRefreshToken());
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setMaxAge(7 * 24 * 3600 * 5); // 5 week

		response.addCookie(accessTokenCookie);
		response.addCookie(refreshTokenCookie);
		try {
			return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("token", token));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("로그인 실패"));
		}
	}

	@GetMapping("/reservations")
	public ResponseEntity<ResponseVO<List<Reservation>>> getReservations(HttpServletRequest request) {
		try {
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);
			List<Reservation> reservations = memberService.getReservationsForMember(id);
			return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("reservations", reservations));
		} catch (AuthenticationException | MemberException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("예약 목록 불러오기 실패"));
		}
	}

	//상담사 전체 리스트 가져오기
	@GetMapping("counselor/list")
	public ResponseEntity<ResponseVO<List<CounselorResponseDto>>> getCounselorList(){
		List<CounselorResponseDto> counselorList=counselorService.getCounselorList();
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("counselorList", counselorList));
	}

	//상담사 상세보기
	@GetMapping("counselor/list/{counselorId}")
	public ResponseEntity<ResponseVO<CounselorResponseDto>> getCounselor(@PathVariable Long counselorId){
		CounselorResponseDto counselor=counselorService.getCounselor(counselorId);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("counselor", counselor));
	}

	//상담사 필터링
	@GetMapping("counselor/filter")
	public ResponseEntity<ResponseVO<List<CounselorResponseDto>>> getFilteredList(
		@RequestParam(required = false) Gender gender,
		@RequestParam(required = false) String field,
		@RequestParam(required = false) String name){

		List<CounselorResponseDto> counselorList=counselorService.filteredList(name,gender,field);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("FilteredCounselorList", counselorList));
	}





}
