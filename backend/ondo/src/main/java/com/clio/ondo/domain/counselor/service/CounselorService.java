package com.clio.ondo.domain.counselor.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import com.clio.ondo.domain.counselor.model.Counselor;
import org.springframework.security.core.AuthenticationException;

import com.clio.ondo.domain.counselor.model.dto.CounselorLoginRequestDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorMyPageResponseDto;
import com.clio.ondo.domain.counselor.model.dto.CounselorResponseDto;
import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.global.auth.jwtUtil.TokenDto;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface CounselorService {
    TokenDto login(CounselorLoginRequestDto loginRequestDto) throws AuthenticationException;
    void join(Counselor counselor);
    List<CounselorResponseDto> getCounselorList();
    CounselorResponseDto getCounselor(Long counselorId);
    List<CounselorResponseDto> filteredList(String name, Gender gender,String field);
	Optional<Counselor> getCounselorEntity(Long id);
    void logout(String token);
    CounselorMyPageResponseDto getMypage(Long counslorId);
    void updateMypage(Long counselorId,String password,String selfIntroduction) throws IOException;

}
