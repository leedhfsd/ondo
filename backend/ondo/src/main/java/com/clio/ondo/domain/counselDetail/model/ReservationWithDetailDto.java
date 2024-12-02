package com.clio.ondo.domain.counselDetail.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationWithDetailDto {
	private Long reservationId;
	private LocalDateTime reservationDate;
	private String counselingReservationDetail;
	private String counsellingDetail;
}
