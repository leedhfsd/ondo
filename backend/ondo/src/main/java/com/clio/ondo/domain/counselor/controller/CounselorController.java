package com.clio.ondo.domain.counselor.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.counselor.model.dto.CounselorJoinRequestDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorLoginRequestDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorMyPageResponseDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorMypageRequestDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorResponseDto;
import com.clio.ondo.domain.counselor.service.CounselorService;
import com.clio.ondo.domain.image.service.ImageService;
import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import com.clio.ondo.global.auth.jwtUtil.TokenDto;
import com.clio.ondo.global.exception.counselor.CounselorAlreadyExistsException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/counselor")
@Slf4j
public class CounselorController {

    private final CounselorService counselorService;
    private final ImageService imageService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${profile.url}")
    String defaultProfileUrl; //기본 프로필 이미지
    String profileUrl;

    @PostMapping("/join")
    public ResponseEntity<ResponseVO<Void>> join(
        @RequestPart("joinRequestDto") CounselorJoinRequestDto joinRequestDto,
        @RequestPart("profileImage") MultipartFile profileImage) {
        try {
            joinRequestDto.setPassword(passwordEncoder.encode(joinRequestDto.getPassword()));

            if(!profileImage.isEmpty()){
                profileUrl=imageService.upload(profileImage,"CounselorProfile");
            }else{
                profileUrl=defaultProfileUrl;
            }

            Counselor counselor = joinRequestDto.toEntity(profileUrl);
            counselorService.join(counselor);
            return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("Success"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("상담사 가입 실패: 올바른 값을 입력해주세요."));
        } catch (CounselorAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("상담사 가입 실패: 이미 가입된 회원입니다."));
        } catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

    @PostMapping("/login")
    public ResponseEntity<ResponseVO<TokenDto>> login(@RequestBody CounselorLoginRequestDto loginRequestDto, HttpServletResponse response) {
        try {
            TokenDto token = counselorService.login(loginRequestDto);
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
            return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("token", token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ResponseVO.failure("로그인 실패"));
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<ResponseVO<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 쿠키에서 accessToken을 추출
            String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
            // 로그아웃 처리
            counselorService.logout(token);

            // accessToken 쿠키 삭제
            Cookie accessTokenCookie = new Cookie("accessToken", null);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(0);

            // refreshToken 쿠키 삭제
            Cookie refreshTokenCookie = new Cookie("refreshToken", null);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(0);

            // 응답에 쿠키 추가
            response.addCookie(accessTokenCookie);
            // refreshToken 쿠키를 응답에 추가 (현재 주석 처리됨)
            response.addCookie(refreshTokenCookie);

            // 로그아웃 성공 응답 반환
            return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("logout"));
        } catch (AuthenticationException e) {
            // 로그아웃 실패 시 응답 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("로그아웃 실패"));
        }
    }

    //상담사 마이페이지 보기
    @GetMapping("/mypage")
    public ResponseEntity<ResponseVO<CounselorMyPageResponseDto>> getMypage(HttpServletRequest request){
        String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
        Long counselorId = jwtTokenProvider.getIdFromToken(token);
        CounselorMyPageResponseDto counselor=counselorService.getMypage(counselorId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("counselor", counselor));
    }
    
    //상담사 수정하기
    @PutMapping("/updateMypage")
    public ResponseEntity<ResponseVO<Void>> updateMypage(HttpServletRequest request, @RequestBody CounselorMypageRequestDto requestDto) throws IOException {
        String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
        Long counselorId = jwtTokenProvider.getIdFromToken(token);
        counselorService.updateMypage(
            counselorId,
            requestDto.getPassword(),
            requestDto.getSelfIntroduction()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("상담사 마이페이지 업데이트"));
    }

    @PostMapping("/updateImage/{type}")
    public ResponseEntity<?> updateMember(@PathVariable String type, @RequestParam("data") MultipartFile file, HttpServletRequest request) throws IOException{
        String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
        Long counselorId = jwtTokenProvider.getIdFromToken(token);
        try{
            imageService.updateAndCounselor(file,type,counselorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(ResponseVO.success("Success"));
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("이미지 수정 실패"));
        }
    }











}
