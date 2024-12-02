package com.clio.ondo.domain.schedule.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.clio.ondo.domain.reservation.model.CounselorReservationAddDto;
import com.clio.ondo.domain.schedule.model.DayScheduleModifyDto;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import io.jsonwebtoken.Jwt;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clio.ondo.domain.schedule.model.Schedule;
import com.clio.ondo.domain.schedule.model.ScheduleDto;
import com.clio.ondo.domain.schedule.service.ScheduleService;
import com.clio.ondo.global.ResponseVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ScheduleController {
	private final ScheduleService scheduleService;
	private final JwtTokenProvider jwtTokenProvider;

	@GetMapping("/api/v1/counselor/schedule")
	public ResponseEntity<?> getSchedule(HttpServletRequest request) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			ScheduleDto schedule = scheduleService.getSchedule(id);
			Map<String, Object> retMap = new HashMap<>();
			retMap.put("schedule", schedule);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "일정 조회 성공", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "일정을 가져올 수 없습니다.", null));
		}
	}

	@GetMapping("/api/v1/counselor/schedule/{date}")
	public ResponseEntity<?> getDaySchedule(HttpServletRequest request, @PathVariable String date) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			List<CounselorReservationAddDto> daySchedule = scheduleService.getDaySchedule(id, date);
			List<LocalDateTime> times = daySchedule.stream()
				.map(CounselorReservationAddDto::getReservationDate)
				.toList();
			Map<String, Object> retMap = new HashMap<>();
			retMap.put("schedule", times);

			return ResponseEntity.status(HttpStatus.OK)
					.body(new ResponseVO<>(true, "일정 조회 성공", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ResponseVO<>(false, "일정을 가져올 수 없습니다.", null));
		}
	}

	@PutMapping("/api/v1/counselor/schedule")
	public ResponseEntity<?> updateSchedule(HttpServletRequest request, @RequestBody ScheduleDto schedule) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			ScheduleDto resultSchedule = scheduleService.updateSchedule(id, schedule);
			Map<String, Object> retMap = new HashMap<>();
			retMap.put("schedule", resultSchedule);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "성공적으로 변경 되었습니다. ", retMap));
		}
		catch(Exception e){
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "일정 변경에 실패했습니다.", null));
		}
	}

	@PostMapping("/api/v1/counselor/schedule/{date}")
	public ResponseEntity<?> setDaySchedule(HttpServletRequest request, @PathVariable String date,
		@RequestBody DayScheduleModifyDto dayScheduleModifyDto) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			List<CounselorReservationAddDto> daySchedule = scheduleService.setDaySchedule(id, date, dayScheduleModifyDto.getSchedule());
			List<LocalDateTime> times = daySchedule.stream()
				.map(CounselorReservationAddDto::getReservationDate)
				.toList();
			Map<String, Object> retMap = new HashMap<>();
			retMap.put("schedule", times);

			return ResponseEntity.status(HttpStatus.OK)
					.body(new ResponseVO<>(true, "일정 변경에 성공했습니다.", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ResponseVO<>(false, "일정 변경에 실패했습니다.", null));
		}
	}
}
