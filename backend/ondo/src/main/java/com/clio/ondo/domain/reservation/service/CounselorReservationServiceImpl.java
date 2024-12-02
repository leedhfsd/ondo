package com.clio.ondo.domain.reservation.service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.clio.ondo.domain.counselDetail.model.CounselDetail;
import com.clio.ondo.domain.counselDetail.repository.CounselDetailRepository;
import com.clio.ondo.domain.reservation.model.CounselorReservationAddRequestDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.counselor.service.CounselorService;
import com.clio.ondo.domain.reservation.model.CounselorReservationAddDto;
import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.domain.reservation.model.CounselorReservationDto;
import com.clio.ondo.domain.reservation.repository.CounselorReservationRepository;
import com.clio.ondo.domain.reservation.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CounselorReservationServiceImpl implements CounselorReservationService{
	private final CounselorReservationRepository counselorReservationRepository;
	private final CounselorService counselorService;
	private final ReservationRepository reservationRepository;
	private final CounselDetailRepository counselDetailRepository;

	// 해당 날짜의 예약 기록을 모두 가져오되 Member가 null인 경우를 제한다.
	@Override
	public List<CounselorReservationDto> getReservationByDate(Long counselorId, String dateStr) {
		LocalDateTime from = convertStartDate(dateStr);
		LocalDateTime to = convertEndDate(dateStr);

		List<Reservation> reservations = counselorReservationRepository.findByDate(counselorId, from, to);
		List<CounselorReservationDto> counselorReservationDtos = new ArrayList<>();
		for(Reservation reservation : reservations) {
			counselorReservationDtos.add(
				CounselorReservationDto.builder()
					.reservationId(reservation.getId())
					.reservationDate(reservation.getReservationDate())
					.memberId(reservation.getMember().getId())
					.memberName(reservation.getMember().getName())
					.memberBirthday(reservation.getMember().getBirthDate())
					.counselingUrl(reservation.getCounselingUrl())
					.build()
			);
		}

		return counselorReservationDtos;
	}

	// 백엔드 내부적으로 호출해서 추가하는 함수
	// 사용자가 호출하는 경우는 없음
	@Override
	@Transactional
	public void addReservation(CounselorReservationAddDto counselorReservationAddDto) {
		System.out.println(counselorReservationAddDto);
		Reservation reservation = new Reservation();
		reservation.setId(null);
		reservation.setReservationDate(counselorReservationAddDto.getReservationDate());
		reservation.setDetail(null);
		reservation.setMember(null);
		// counselorId로 서비스에서 가져와야겠네..
		reservation.setCounselor(counselorService.getCounselorEntity(counselorReservationAddDto.getCounselorId()).get());
		reservation.setCounselingUrl(null);
		reservation.setCounselDetail(null);

		counselorReservationRepository.save(reservation);
	}

	// Get으로 호출할 때는 문자열로만 받을 수 있으니 Request 객체가 달라야 함
	@Override
	@Transactional
	public void addRequestReservation(CounselorReservationAddRequestDto counselorReservationAddRequestDto) {
		Reservation reservation = new Reservation();
		reservation.setId(null);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSX");
		LocalDateTime dateTime = LocalDateTime.parse(counselorReservationAddRequestDto.getReservationDate(), formatter.withZone(ZoneOffset.UTC));
		reservation.setReservationDate(dateTime);
		reservation.setDetail(null);
		reservation.setMember(null);
		// counselorId로 서비스에서 가져와야겠네..
		reservation.setCounselor(counselorService.getCounselorEntity(counselorReservationAddRequestDto.getCounselorId()).get());
		reservation.setCounselingUrl(null);
		reservation.setCounselDetail(null);

		counselorReservationRepository.save(reservation);
	}

	// 예약 삭제
	@Override
	@Transactional
	public void deleteReservation(Long reservationId) {

		// Reservation을 조회
		Reservation reservation = reservationRepository.findById(reservationId)
			.orElseThrow(() -> new IllegalArgumentException("해당 예약이 없습니다. id=" + reservationId));
		// CounselDetail을 가져와서 삭제
		CounselDetail counselDetail = reservation.getCounselDetail();
		if (counselDetail != null) {
			counselDetailRepository.delete(counselDetail);
		}
		counselorReservationRepository.deleteById(reservationId);
	}

	@Override
	public List<CounselorReservationDto> getAllReservation(Long counselorId, Pageable pageable){
		Page<Reservation> pages = counselorReservationRepository.findByCounselorId(counselorId, pageable);
		List<Reservation> reservations = pages.getContent();
		List<CounselorReservationDto> counselorReservationDtos = new ArrayList<>();
		for(Reservation reservation : reservations) {
			counselorReservationDtos.add(CounselorReservationDto.builder()
				.reservationId(reservation.getId())
				.reservationDate(reservation.getReservationDate())
				.memberId(reservation.getMember().getId())
				.memberName(reservation.getMember().getName())
				.memberBirthday(reservation.getMember().getBirthDate())
				.counselingUrl(reservation.getCounselingUrl())
				.build()
			);
		}

		return counselorReservationDtos;
	}

	@Override
	public List<CounselorReservationDto> searchReservationByName(Long counselorId, String name, Pageable pageable){
		Page<Reservation> pages = counselorReservationRepository.findByCounselorIdAndMemberName(counselorId, name, pageable);
		List<Reservation> reservations = pages.getContent();
		List<CounselorReservationDto> counselorReservationDtos = new ArrayList<>();
		for(Reservation reservation : reservations) {
			counselorReservationDtos.add(CounselorReservationDto.builder()
				.reservationId(reservation.getId())
				.reservationDate(reservation.getReservationDate())
				.memberId(reservation.getMember().getId())
				.memberName(reservation.getMember().getName())
				.memberBirthday(reservation.getMember().getBirthDate())
				.counselingUrl(reservation.getCounselingUrl())
				.build()
			);
		}

		return counselorReservationDtos;
	}

	@Override
	public LocalDateTime convertStartDate(String dateStr) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
		LocalDate date = LocalDate.parse(dateStr, formatter);
		return date.atStartOfDay();
	}

	@Override
	public LocalDateTime convertEndDate(String dateStr) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
		LocalDate date = LocalDate.parse(dateStr, formatter);
		LocalTime endOfDay = LocalTime.of(23, 59, 59);
		return date.atTime(endOfDay);
	}
}
