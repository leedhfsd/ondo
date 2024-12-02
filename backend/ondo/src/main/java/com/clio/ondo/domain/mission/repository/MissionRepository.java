package com.clio.ondo.domain.mission.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.clio.ondo.domain.mission.model.Mission;

public interface MissionRepository extends MongoRepository<Mission, ObjectId> {

	List<Mission> findByCompleteFlag(boolean completeFlag);
	List<Mission> findByType(String type);
}
