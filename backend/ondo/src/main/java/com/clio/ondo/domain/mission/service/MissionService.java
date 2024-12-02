package com.clio.ondo.domain.mission.service;

import com.clio.ondo.domain.mission.model.Mission;
import com.clio.ondo.domain.mission.model.MissionDetail;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

public interface MissionService {

	// 스케줄링 된 메서드
	void updateMission();

	// 완료한 특별미션 completeMission에 넣기
	void putCompleteMission(Long memberId);

	// MissionDetail에서 특별미션 랜덤 3개 추출
	List<MissionDetail> createRandomMission();

	// 오늘의 특별+데일리 미션 todayMission에 저장
	void createTodayMission(Long memberId);

	// 해당하는 멤버의 미션 가져오기
	List<Mission> getTodayMission(Long memberId);

	// 완료한 미션 업데이트 및 포인트 추출
	void updateCompleteMission(Long memberId, String title);

	// 멤버별 완료한 특별미션 전체조회
	List<Mission> getCompleteMission(Long memberId);

	@Transactional
	void addCompleteMission(Long memberId, List<MissionDetail> missionDetails);
}
