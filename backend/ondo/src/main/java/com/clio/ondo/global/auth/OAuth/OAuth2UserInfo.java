package com.clio.ondo.global.auth.OAuth;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.domain.member.model.Member;
import com.clio.ondo.domain.member.model.Role;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OAuth2UserInfo {
    private String name;
    private String nickname;
    private String gender;
    private String profileUrl;
    private String email;
    private LocalDate birthDate;

    public static OAuth2UserInfo of(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId) {
            case "kakao" -> ofKakao(registrationId, attributes);
            case "naver" -> ofNaver(registrationId, attributes);
            default -> throw new RuntimeException();
        };
    }

    private static OAuth2UserInfo ofKakao(String provider,
                                           Map<String, Object> attributes) {
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");

        return OAuth2UserInfo.builder()
                .name((String) account.get("name"))
                .nickname((String) profile.get("nickname"))
                .gender(account.get("gender").toString().toUpperCase())
                .profileUrl((String) profile.get("profile_image_url"))
                .email((String) account.get("email"))
                .birthDate(convertToBirthDate(account.get("birthyear").toString(), account.get("birthday").toString()))
                .build();
    }

    private static OAuth2UserInfo ofNaver(String provider,
                                           Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        String birthdate = response.get("birthyear").toString() + "-" + response.get("birthday").toString();
        String gender = response.get("gender").toString().equals("M") ? "MALE" : "FEMALE";

        return OAuth2UserInfo.builder()
                .name((String) response.get("name"))
                .nickname((String) response.get("nickname"))
                .gender(gender)
                .profileUrl((String) response.get("profile_image"))
                .email((String) response.get("email"))
                .birthDate(LocalDate.parse(birthdate, DateTimeFormatter.ISO_DATE))
                .build();
    }

    public Member toEntity() {
        return Member.builder()
                .name(name)
                .nickname(nickname)
                .gender(Gender.valueOf(gender))
                .profileUrl(profileUrl)
                .email(email)
                .birthDate(birthDate)
                .role(Role.ROLE_USER)
                .build();
    }

    public static LocalDate convertToBirthDate(String birthyear, String birthday) {
        String birthDateString = birthyear + birthday;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return LocalDate.parse(birthDateString, formatter);
    }
}
