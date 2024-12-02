package com.clio.ondo.domain.counselDetail.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clio.ondo.domain.counselDetail.model.MemberForCounselorDto;
import com.clio.ondo.domain.counselDetail.model.ReservationWithDetailDto;
import com.clio.ondo.domain.counselDetail.service.CounselDetailService;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CounselDetailController {
	private final JwtTokenProvider jwtTokenProvider;
	private final CounselDetailService counselDetailService;

	@GetMapping("/api/v1/counselor/getMember")
	public ResponseEntity<?> getMemberDetail(@RequestParam Long memberId) {
		try{
			MemberForCounselorDto memberForCounselorDto = counselDetailService.getMemberForCounselor(memberId);
			Map<String, Object> retMap = new HashMap<String, Object>();
			retMap.put("member", memberForCounselorDto);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "내담자 정보 조회에 성공했습니다.", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "내담자 정보 조회에 실패했습니다.", null));
		}
	}

	@GetMapping("/api/v1/counselor/memberReservation")
	public ResponseEntity<?> getCounselDetail(HttpServletRequest request, @RequestParam Long memberId, Pageable pageable) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			List<ReservationWithDetailDto> reservationWithDetailDtos = counselDetailService.getRerservationWithDetail(memberId, id, pageable);
			Map<String, Object> retMap = new HashMap<String, Object>();
			retMap.put("reservations", reservationWithDetailDtos);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "예약 목록 조회에 성공했습니다.", retMap));
		}
		catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "예약 목록 조회에 실패했습니다..", null));
		}
	}

	@PutMapping("/api/v1/counselor/memberReservation")
	public ResponseEntity<?> updateCounselDetail(HttpServletRequest request, @RequestBody ReservationWithDetailDto reservationWithDetailDto) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);

			ReservationWithDetailDto updated = counselDetailService.updateReservationCounselingDetail(id, reservationWithDetailDto);
			Map<String, Object> retMap = new HashMap<String, Object>();
			retMap.put("reservation", updated);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "수정에 성공했습니다.", retMap));
		}
		catch(Exception e){
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "수정에 실패했습니다.", null));
		}
	}
}
