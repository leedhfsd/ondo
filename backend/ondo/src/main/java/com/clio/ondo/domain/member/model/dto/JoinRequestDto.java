package com.clio.ondo.domain.member.model.dto;

import java.time.LocalDate;

import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.model.Role;

import lombok.AllArgsConstructor;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class JoinRequestDto {
    private String email;
    private String name;
    private String nickname;
    private String password;
    private LocalDate birthDate;
    private String gender;

    public Member toEntity(String profileImageUrl) {
        return Member.builder()
                .email(email)
                .name(name)
                .nickname(nickname)
                .password(password)
                .birthDate(birthDate)
                .gender(Gender.valueOf(gender))
                .role(Role.valueOf("ROLE_USER"))
                .profileUrl(profileImageUrl)
                .build();
    }
}
