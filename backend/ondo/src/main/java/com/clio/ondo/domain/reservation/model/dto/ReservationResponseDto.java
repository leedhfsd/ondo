package com.clio.ondo.domain.reservation.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
public class ReservationResponseDto {

	private Long counselDetailId;  // 상담 상세 ID
	private Long counselorId;      // 상담사 ID
	private Long id;               // 기본 키 (자동 증가)
	private Long memberId;         // 회원 ID
	private LocalDateTime reservationDate; // 예약 날짜 및 시간
	private String detail; // 상담 예약 상세
	private String counselingUrl;  // 상담 URL


}
