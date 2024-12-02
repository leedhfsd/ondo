package com.clio.ondo.domain.counselor.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.clio.ondo.domain.career.service.CareerService;
import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.counselor.model.QCounselor;
import com.clio.ondo.domain.counselor.model.dto.CounselorLoginRequestDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorMyPageResponseDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorResponseDto;
import com.clio.ondo.domain.counselor.repository.CounselorRepository;
import com.clio.ondo.domain.image.service.ImageService;
import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.domain.schedule.model.Schedule;
import com.clio.ondo.domain.schedule.repository.ScheduleRepository;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.auth.jwtUtil.TokenDto;
import com.clio.ondo.global.exception.counselor.CounselorAlreadyExistsException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CounselorServiceImpl implements CounselorService {

    private final JwtTokenProvider jwtTokenProvider;
    private final DaoAuthenticationProvider counselorAuthenticationProvider;
    private final CounselorRepository counselorRepository;
    private final ScheduleRepository scheduleRepository;
    private final CareerService careerService;
    private final ImageService imageService;
    private final PasswordEncoder passwordEncoder;
    private final JPAQueryFactory queryFactory;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${profile.url}")
    String defaultProfileUrl;
    String profileUrl;

    @Override
    public TokenDto login(CounselorLoginRequestDto loginRequestDto) throws AuthenticationException {

        System.out.println(loginRequestDto.getPassword());
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(loginRequestDto.getId(), loginRequestDto.getPassword());
        System.out.println(authToken);
        Authentication authentication = counselorAuthenticationProvider.authenticate(authToken);
        String accessToken = jwtTokenProvider.generateCounselorAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateCounselorRefreshToken(authentication);

        return new TokenDto(accessToken, refreshToken);
    }

    @Override
    @Transactional
    public void join(Counselor counselor) {
        Optional<Counselor> optionalCounselor = counselorRepository.findByCounselorId(counselor.getCounselorId());
        if (optionalCounselor.isPresent()) {
            throw new CounselorAlreadyExistsException("이미 존재하는 상담사입니다.");
        }
        if (counselor.getSchedule() == null) {
            Schedule schedule = new Schedule(counselor);
            counselor.updateSchedule(schedule);
            schedule.setCounselor(counselor);
            scheduleRepository.save(schedule);
        }


        counselorRepository.save(counselor);
    }

    //마이페이지 보기
    @Override
    public CounselorMyPageResponseDto getMypage(Long counselorId){
        Optional<Counselor> counselor=counselorRepository.findById(counselorId);

        if(counselor.isPresent()){

            CounselorMyPageResponseDto counselorDto=new CounselorMyPageResponseDto();
            Counselor c=counselor.get();
            counselorDto.setId(counselorId);
            counselorDto.setCounselorId(c.getCounselorId());
            counselorDto.setPassword(c.getPassword());
            counselorDto.setName(c.getName());
            counselorDto.setGender(c.getGender());
            counselorDto.setField(c.getField());
            counselorDto.setSelfIntroduction(c.getSelfIntroduction());
            counselorDto.setProfileUrl(c.getProfileUrl());
            counselorDto.setCareer(careerService.getCareer(c.getId()));

            return counselorDto;
        }
        return null;
    }

    //마이페이지 수정하기
    @Transactional
    @Override
    public void updateMypage(Long counselorId,String password,String selfIntroduction) throws IOException {
        Optional<Counselor> counselor=counselorRepository.findById(counselorId);

        if(counselor.isPresent()){
            Counselor changeCounselor=counselor.get();

            if (password != null && !password.isEmpty()) {
                changeCounselor.updatePassword(passwordEncoder.encode(password));
            }
            if (selfIntroduction !=null && !selfIntroduction.isEmpty()) {
                changeCounselor.updateSelfIntroduction(selfIntroduction);
            }

            //기본 이미지가 아니라면
            if(!Objects.equals(changeCounselor.getProfileUrl(), defaultProfileUrl)){
                imageService.delete(changeCounselor.getProfileUrl(),"CounselorProfile"); //원래 프로필 이미지 삭제
            }

            counselorRepository.save(changeCounselor);
        }else{
            //예외처리
        }
    }


    //상담사 전체 리스트 가져오기
    @Override
    public List<CounselorResponseDto> getCounselorList(){
        List<Counselor> counselors=counselorRepository.findAll();
        List<CounselorResponseDto> counselorList=new ArrayList<>();

        for(Counselor c:counselors){

            CounselorResponseDto dto=new CounselorResponseDto();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setField(c.getField());
            dto.setGender(c.getGender());
            dto.setSelfIntroduction(c.getSelfIntroduction());
            dto.setProfileUrl(c.getProfileUrl());
            dto.setCareer(careerService.getCareer(c.getId()));
            counselorList.add(dto);
        }

        return counselorList;
    }

    //상담사 상세보기
    @Override
    public CounselorResponseDto getCounselor(Long counselorId){

        Optional<Counselor> counselor=counselorRepository.findById(counselorId);
        if(counselor.isPresent()){
            CounselorResponseDto counselorDto=new CounselorResponseDto();
            Counselor c=counselor.get();
            counselorDto.setId(c.getId());
            counselorDto.setName(c.getName());
            counselorDto.setField(c.getField());
            counselorDto.setGender(c.getGender());
            counselorDto.setSelfIntroduction(c.getSelfIntroduction());
            counselorDto.setProfileUrl(c.getProfileUrl());
            counselorDto.setCareer(careerService.getCareer(c.getId()));
            return counselorDto;
        }else{
            return null;
        }
    }

    //상담사 필터링된 리스트 가져오기
    @Override
    public List<CounselorResponseDto> filteredList(String name, Gender gender,String field){

        QCounselor counselor = QCounselor.counselor;
        BooleanBuilder builder=new BooleanBuilder();
        if(gender!=null){
            builder.and(counselor.gender.eq(gender));
        }
        if(field!=null){
            builder.and(counselor.field.eq(field));
        }
        if(name!=null){
            builder.and(counselor.name.eq(name));
        }


        // 기본 Counselor 데이터 조회
        List<Counselor> counselors = queryFactory.selectFrom(counselor)
            .where(builder)
            .fetch();

        // 엔티티를 DTO로 변환
        return counselors.stream()
            .map(c -> {
                // Counselor의 ID로 Career 정보를 가져오기
                List<String> careerDescriptions = careerService.getCareer(c.getId());

                // DTO 생성
                return new CounselorResponseDto(
                    c.getId(),
                    c.getName(),
                    c.getGender(),
                    c.getField(),
                    careerDescriptions,
                    c.getSelfIntroduction(),
                    c.getProfileUrl()
                );
            })
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Counselor> getCounselorEntity(Long id) {
        return counselorRepository.findById(id);
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
}
