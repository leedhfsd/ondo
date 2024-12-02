package com.clio.ondo.domain.member.model.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MemberResponseDto {
	private Long id;
	private String name;
	private String nickname;
	private String role;
	private String email;
	private String profileUrl;
	private String gender;
	private LocalDate birthDate;
}
