package com.clio.ondo.domain.mission.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clio.ondo.domain.mission.model.Mission;
import com.clio.ondo.domain.mission.model.MissionDetail;
import com.clio.ondo.domain.mission.model.MissionDetailList;
import com.clio.ondo.domain.mission.repository.MissionDetailRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MissionDetailService {
	private final MissionDetailRepository missionDetailRepository;

	public MissionDetailList<MissionDetail> findAll() {
		return new MissionDetailList<>(missionDetailRepository.findByType("typical"));
	}

	public MissionDetailList<MissionDetail> findByLevel(int level) {
		return new MissionDetailList<>(missionDetailRepository.findByLevel(level));
	}
}
