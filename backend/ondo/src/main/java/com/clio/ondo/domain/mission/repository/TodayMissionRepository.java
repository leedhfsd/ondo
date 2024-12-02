package com.clio.ondo.domain.mission.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.clio.ondo.domain.mission.model.MissionDetail;
import com.clio.ondo.domain.mission.model.TodayMission;

public interface TodayMissionRepository extends MongoRepository<TodayMission, ObjectId>, CustomMissionRepository {
	//List<TodayMission> findByType(String type);
	TodayMission findByMemberId(Long memberId);
}
