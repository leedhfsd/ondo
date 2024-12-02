package com.clio.ondo.domain.mission.repository;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.mission.model.Mission;

public interface CustomMissionRepository {
	@Transactional
	void upsertByMemberId(Long memberId, List<Mission> missions);
}
