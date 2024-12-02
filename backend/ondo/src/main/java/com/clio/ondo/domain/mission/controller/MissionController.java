package com.clio.ondo.domain.mission.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clio.ondo.domain.mission.model.Mission;
import com.clio.ondo.domain.mission.model.dto.CompleteRequestDto;
import com.clio.ondo.domain.mission.service.MissionService;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/mission")
public class MissionController {

	@Autowired
	private MissionService missionService;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	//스케줄링 된 메서드 TEST 용
	//-------------------------------------------------------
	//3개의 랜덤 특별 미션 + 데일리 미션 todayMission에 저장
	@GetMapping("/update")
	public ResponseEntity<ResponseVO<Void>> updateTodayMission(HttpServletRequest request){
		String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
		Long memberId = jwtTokenProvider.getIdFromToken(token);
		missionService.createTodayMission(memberId);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("오늘 미션 업데이트"));
	}
	//
	// //완료한 특별 미션 completeMission에 넣기 + 나머지 삭제
	@GetMapping("/clearMission")
	public ResponseEntity<ResponseVO<Void>> clearMission(HttpServletRequest request) {
		String token = jwtTokenProvider.getJwtTokenFromRequestHeader(request);
		Long memberId = jwtTokenProvider.getIdFromToken(token);

		missionService.putCompleteMission(memberId);
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("어제 미션 완료 처리"));
	}
	//-------------------------------------------------------

	//오늘의 특별미션 가져오기
	@GetMapping("/todayTypical")
	public ResponseEntity<ResponseVO<List<Mission>>> getTodayTypical(HttpServletRequest request){
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);

		List<Mission> todayMission= missionService.getTodayMission(memberId);
		List<Mission> typicalMissions = todayMission.stream()
			.filter(mission -> "typical".equals(mission.getType()))
			.toList();

		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("typicalMission", typicalMissions));
	}

	//오늘의 데일리미션 가져오기
	@GetMapping("/todayDaily")
	public ResponseEntity<ResponseVO<List<Mission>>> getTodayDaily(HttpServletRequest request){
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);

		List<Mission> todayMission= missionService.getTodayMission(memberId);
		List<Mission> dailyMissions = todayMission.stream()
			.filter(mission -> "daily".equals(mission.getType()))
			.toList();

		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("dailyMission", dailyMissions));

	}

	//완료한 미션 완료처리
	@PostMapping("/complete")
	public ResponseEntity<ResponseVO<Void>> completeMission(HttpServletRequest request,
		@RequestBody CompleteRequestDto completeRequest){
		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);
		String title=completeRequest.getTitle();
		missionService.updateCompleteMission(memberId, title);
		
		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("미션 완료 처리"));
	}

	//멤버별 완료한 특별미션 전체조회
	@GetMapping("/getComplete")
	public ResponseEntity<ResponseVO<List<Mission>>> getCompleteMission(HttpServletRequest request) {

		String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
		Long memberId = jwtTokenProvider.getIdFromToken(token);

		List<Mission> completeMisison=missionService.getCompleteMission(memberId);

		return ResponseEntity.status(HttpStatus.OK).body(ResponseVO.success("completeMission", completeMisison));

	}


}
