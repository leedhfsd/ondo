package com.clio.ondo.domain.counselor.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class CounselorMypageRequestDto {

	private String password; //비밀번호 바꾸기 추후 기능 구현
	private String selfIntroduction;

}
