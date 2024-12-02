package com.clio.ondo.domain.mission.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MissionScheduler {

	@Autowired
	MissionService missionService;

	@Scheduled(cron="0 0 21 1/1 * *") //매일 오전 6시에 실행
	//@Scheduled(cron="0 44 16 1/1 * *") //매일 오전 6시에 실행
	public void missionSchedule(){
		missionService.updateMission(); //모든 멤버에 대해 어제 미션 정리 + 오늘 미션 업데이트
	}

}
