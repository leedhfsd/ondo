package com.clio.ondo.domain.counselor.model.dto;

import java.util.List;

import com.clio.ondo.domain.member.model.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class CounselorMyPageResponseDto {

	private Long id;

	private String counselorId;
	private String password;

	private String name;
	private Gender gender;
	private String field;

	private List<String> career;
	private String selfIntroduction;
	private String profileUrl;

}
