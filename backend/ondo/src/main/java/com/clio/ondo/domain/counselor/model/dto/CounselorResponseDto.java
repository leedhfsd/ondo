package com.clio.ondo.domain.counselor.model.dto;

import java.util.List;

import com.clio.ondo.domain.career.model.Career;
import com.clio.ondo.domain.counselor.model.Counselor;
import com.clio.ondo.domain.member.model.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class CounselorResponseDto {
    private Long id;

    private String name;
    private Gender gender;
    private String field;

    private List<String> career;
    private String selfIntroduction;
    private String profileUrl;

    // 기본 생성자
    public CounselorResponseDto() {
    }

    // 필요한 필드를 포함한 생성자 (Querydsl에서 사용)
    public CounselorResponseDto(Long id, String name, Gender gender, String field, List<String> career, String selfIntroduction, String profileUrl) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.field = field;
        this.career = career;
        this.selfIntroduction = selfIntroduction;
        this.profileUrl = profileUrl;
    }
}
