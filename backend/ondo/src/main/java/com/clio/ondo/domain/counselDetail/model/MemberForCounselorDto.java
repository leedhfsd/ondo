package com.clio.ondo.domain.counselDetail.model;

import java.time.LocalDate;
import java.util.List;

import com.clio.ondo.domain.member.model.Gender;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberForCounselorDto {
	private Long memberId;
	private String memberName;
	private Gender gender;
	private LocalDate birthDate;
	// private List<ReservationWithDetailDto> reservations;
}
