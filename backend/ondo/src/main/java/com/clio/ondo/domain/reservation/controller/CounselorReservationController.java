package com.clio.ondo.domain.reservation.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.clio.ondo.domain.reservation.model.CounselorReservationAddRequestDto;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clio.ondo.domain.reservation.model.CounselorReservationAddDto;
import com.clio.ondo.domain.reservation.model.CounselorReservationDto;
import com.clio.ondo.domain.reservation.model.DeleteReservationDto;
import com.clio.ondo.domain.reservation.service.CounselorReservationService;
import com.clio.ondo.global.ResponseVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CounselorReservationController {
	private final JwtTokenProvider jwtTokenProvider;
	private final CounselorReservationService counselorReservationService;

	@GetMapping("/api/v1/counselor/reservation/{date}")
	public ResponseEntity<?> getReservation(HttpServletRequest request, @PathVariable String date) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			List<CounselorReservationDto> list = counselorReservationService.getReservationByDate(id, date);
			Map<String, Object> retMap = new HashMap<>();
			retMap.put("reservations", list);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "조회에 성공했습니다.", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "조회에 실패했습니다.", null));
		}
	}

	@PostMapping("/api/v1/counselor/reservation")
	public ResponseEntity<?> addReservation(@RequestBody CounselorReservationAddRequestDto reservationAddDto) {
		try{
			counselorReservationService.addRequestReservation(reservationAddDto);

			return ResponseEntity.status(HttpStatus.OK)
					.body(new ResponseVO<>(true, "추가에 성공했습니다.", null));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ResponseVO<>(false, "추가에 실패했습니다.", null));
		}
	}

	@DeleteMapping("/api/v1/counselor/reservation")
	public ResponseEntity<?> deleteReservation(@RequestBody DeleteReservationDto deleteReservationDto) {
		try{
			counselorReservationService.deleteReservation(deleteReservationDto.getReservationId());

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "삭제에 성공했습니다.", null));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "삭제에 실패했습니다.", null));
		}
	}

	@GetMapping("/api/v1/counselor/reservation")
	public ResponseEntity<?> getAllReservation(HttpServletRequest request, Pageable pageable) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			List<CounselorReservationDto> reservationDtos = counselorReservationService.getAllReservation(id, pageable);

			Map<String, Object> retMap = new HashMap<>();
			retMap.put("reservations", reservationDtos);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "조회에 성공했습니다.", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "조회에 실패했습니다.", null));
		}
	}

	@GetMapping("/api/v1/counselor/reservation/search/{name}")
	public ResponseEntity<?> searchReservationByName(HttpServletRequest request, @PathVariable String name, Pageable pageable) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			List<CounselorReservationDto> reservationDtos = counselorReservationService.searchReservationByName(id, name, pageable);

			Map<String, Object> retMap = new HashMap<>();
			retMap.put("reservations", reservationDtos);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "조회에 성공했습니다.", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "조회에 실패했습니다.", null));
		}
	}
}
