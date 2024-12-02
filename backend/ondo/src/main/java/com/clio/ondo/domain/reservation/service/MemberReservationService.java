package com.clio.ondo.domain.reservation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clio.ondo.domain.reservation.model.dto.ReservationRequestDto;
import com.clio.ondo.domain.reservation.model.dto.ReservationResponseDto;

@Service
public interface MemberReservationService {

	List<ReservationResponseDto> getReservationList(Long memberId);
	void cancelReservation(Long reservationId);
	List<String> getCounselorSchedule(Long counselorId);
	void makeReservation(ReservationRequestDto requestDto,Long memberId);
}
