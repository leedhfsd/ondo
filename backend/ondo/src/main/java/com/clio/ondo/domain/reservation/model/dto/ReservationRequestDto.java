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
public class ReservationRequestDto {

	private Long counselorId;      // 상담사 ID
	private String reservationDate; // 예약 날짜 및 시간
	private String detail; // 상담 예약 상세, 메모 남긴 부분

}
