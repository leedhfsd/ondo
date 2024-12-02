package com.clio.ondo.domain.mission.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.clio.ondo.domain.mission.model.MissionDetail;

public interface MissionDetailRepository extends MongoRepository<MissionDetail, ObjectId> {
	List<MissionDetail> findByType(String type);
	@Query("{ 'level': { $lte: ?0 } }")
	List<MissionDetail> findByLevel(int level);
}
