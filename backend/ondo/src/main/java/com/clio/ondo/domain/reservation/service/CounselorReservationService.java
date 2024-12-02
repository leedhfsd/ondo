package com.clio.ondo.domain.reservation.service;

import java.time.LocalDateTime;
import java.util.List;

import com.clio.ondo.domain.reservation.model.CounselorReservationAddRequestDto;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.reservation.model.CounselorReservationAddDto;
import com.clio.ondo.domain.reservation.model.CounselorReservationDto;
import com.clio.ondo.domain.reservation.model.Reservation;

@Service
public interface CounselorReservationService {
	// 해당 날짜의 예약 기록을 모두 가져오되 Member가 null인 경우를 제한다.
	List<CounselorReservationDto> getReservationByDate(Long counselorId, String dateStr);

	@Transactional
	void addReservation(CounselorReservationAddDto counselorReservationAddDto);

	@Transactional
	void addRequestReservation(CounselorReservationAddRequestDto counselorReservationAddRequestDto);

	@Transactional
	void deleteReservation(Long reservationId);

	List<CounselorReservationDto> getAllReservation(Long counselorId, Pageable pageable);

	List<CounselorReservationDto> searchReservationByName(Long counselorId, String name, Pageable pageable);

	LocalDateTime convertStartDate(String dateStr);

	LocalDateTime convertEndDate(String dateStr);
}
