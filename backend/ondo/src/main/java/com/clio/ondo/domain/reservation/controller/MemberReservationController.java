package com.clio.ondo.domain.reservation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clio.ondo.domain.reservation.model.dto.ReservationRequestDto;
import com.clio.ondo.domain.reservation.model.dto.ReservationResponseDto;
import com.clio.ondo.domain.reservation.service.MemberReservationService;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/member/reservation")
@Slf4j
public class MemberReservationController {

	private final MemberReservationService memberReservationService;
	private final JwtTokenProvider jwtTokenProvider;

	//자신의 예약 내역 가져오기
	@GetMapping("/getReservation")
	public ResponseEntity<ResponseVO<List<ReservationResponseDto>>> getReservation(HttpServletRequest request){
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);
		List<ReservationResponseDto> reservationList=memberReservationService.getReservationList(memberId);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("reservationList", reservationList));
	}

	//자신의 예약 내역 취소하기
	@DeleteMapping("/cancel/{reservationId}")
	public ResponseEntity<ResponseVO<Void>> cancelReservation(@PathVariable Long reservationId){
		memberReservationService.cancelReservation(reservationId);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("에약 삭제 완료"));
	}

	//해당 상담사의 예약 내역 가져오기
	@GetMapping("/counselor/{counselorId}")
	public ResponseEntity<ResponseVO<List<String>>> getCounselorSchedule(@PathVariable Long counselorId){
		List<String> scheduleList=memberReservationService.getCounselorSchedule(counselorId);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("counselorSchedule", scheduleList));
	}

	//예약하기
	@PostMapping("/make")
	public ResponseEntity<ResponseVO<Void>> createReservation(@RequestBody ReservationRequestDto requestDto, HttpServletRequest request) {
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);
		memberReservationService.makeReservation(requestDto,memberId);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("예약 완료"));
	}

}
