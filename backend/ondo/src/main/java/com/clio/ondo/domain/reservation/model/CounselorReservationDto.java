package com.clio.ondo.domain.reservation.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.clio.ondo.domain.member.model.Gender;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CounselorReservationDto {
	private Long reservationId;
	private LocalDateTime reservationDate;
	private Long memberId;
	private String memberName;
	private LocalDate memberBirthday;
	private String counselingUrl;
}
