package com.clio.ondo.domain.mission.repository;

import java.io.ObjectInput;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.clio.ondo.domain.mission.model.CompleteMission;
import com.clio.ondo.domain.mission.model.TodayMission;

public interface CompleteMissionRepository extends MongoRepository<CompleteMission, ObjectId> {
	CompleteMission findByMemberId(Long memberId);
}
