package com.clio.ondo.domain.counselor.model.dto;

import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.member.model.Gender;
import com.clio.ondo.domain.member.model.Role;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class CounselorJoinRequestDto {
    
    private String id;
    private String password;
    private String gender;
    private String name;
    private String field;
    private String selfIntroduction;

    @Builder
    public Counselor toEntity(String profileUrl) {
        return Counselor.builder()
                .counselorId(id)
                .selfIntroduction(selfIntroduction)
                .field(field)
                .name(name)
                .password(password)
                .profileUrl(profileUrl)
                .gender(Gender.valueOf(gender))
                .role(Role.ROLE_COUNSELOR)
                .build();
    }
}
