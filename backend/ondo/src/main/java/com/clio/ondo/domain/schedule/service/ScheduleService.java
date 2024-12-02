package com.clio.ondo.domain.schedule.service;

import com.clio.ondo.domain.reservation.model.CounselorReservationAddDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.schedule.model.Schedule;
import com.clio.ondo.domain.schedule.model.ScheduleDto;

import java.util.List;

@Service
public interface ScheduleService {

	ScheduleDto getSchedule(Long counselorId);

	@Transactional
	ScheduleDto updateSchedule(Long counselorId, ScheduleDto newSchedule);

	List<CounselorReservationAddDto> getDaySchedule(Long counselorId, String date);

	@Transactional
	List<CounselorReservationAddDto> setDaySchedule(Long counselorId, String dateStr,
		List<String> reservations);
}
