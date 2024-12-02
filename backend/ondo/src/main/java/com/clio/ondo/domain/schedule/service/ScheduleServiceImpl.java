package com.clio.ondo.domain.schedule.service;

import com.clio.ondo.domain.counselor.service.CounselorService;
import com.clio.ondo.domain.reservation.model.CounselorReservationAddDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.reservation.model.Reservation;
import com.clio.ondo.domain.reservation.repository.CounselorReservationRepository;
import com.clio.ondo.domain.schedule.model.Schedule;
import com.clio.ondo.domain.schedule.model.ScheduleDto;
import com.clio.ondo.domain.schedule.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
	private final ScheduleRepository scheduleRepository;
	private final CounselorReservationRepository counselorReservationRepository;
	private final CounselorService counselorService;

	@Override
	public ScheduleDto getSchedule(Long counselorId){
		Schedule schedule = scheduleRepository.findByCounselorId(counselorId);
		return new ScheduleDto(schedule);
	}

	@Override
	@Transactional
	public ScheduleDto updateSchedule(Long counselorId, ScheduleDto newSchedule){
		Schedule schedule = scheduleRepository.findByCounselorId(counselorId);
		schedule.update(newSchedule);

		return getSchedule(counselorId);
	}

	@Override
	public List<CounselorReservationAddDto> getDaySchedule(Long counselorId, String dateStr){
		LocalDateTime start = convertStartDate(dateStr);
		LocalDateTime end = convertEndDate(dateStr);

		List<Reservation> reservations = counselorReservationRepository.findByDateAndId(counselorId, start, end);
		List<CounselorReservationAddDto> counselorReservationAddDtos = reservations.stream()
			.map(reservation -> CounselorReservationAddDto.builder()
				.counselorId(reservation.getCounselor().getId())
				.reservationDate(reservation.getReservationDate())
				.build())
			.collect(Collectors.toList());

		return counselorReservationAddDtos;
	}

	@Override
	@Transactional
	public List<CounselorReservationAddDto> setDaySchedule(Long counselorId, String dateStr,
		List<String> dateList){
		LocalDateTime start = convertStartDate(dateStr);
		LocalDateTime end = convertEndDate(dateStr);

		// 있는거 다 지우고 다시 넣어야 된다...
		counselorReservationRepository.deleteEntitiesByCounselorIdAndReservationDateBetween(counselorId, start, end);

		List<Reservation> inputReservation = dateList.stream()
			.map(date -> {
				Reservation r = new Reservation();
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
				LocalDateTime dateTime = LocalDateTime.parse(date, formatter.withZone(ZoneOffset.UTC));
				r.setReservationDate(dateTime);
				r.setCounselor(counselorService.getCounselorEntity(counselorId).get());
				return r;
			})
			.toList();

		counselorReservationRepository.saveAll(inputReservation);

		return getDaySchedule(counselorId, dateStr);
	}

	public LocalDateTime convertStartDate(String dateStr) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
		LocalDate date = LocalDate.parse(dateStr, formatter);
		return date.atStartOfDay();
	}

	public LocalDateTime convertEndDate(String dateStr) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
		LocalDate date = LocalDate.parse(dateStr, formatter);
		LocalTime endOfDay = LocalTime.of(23, 59, 59);
		return date.atTime(endOfDay);
	}
}
