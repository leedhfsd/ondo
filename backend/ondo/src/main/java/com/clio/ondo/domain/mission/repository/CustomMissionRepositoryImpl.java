package com.clio.ondo.domain.mission.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.mission.model.Mission;
import com.clio.ondo.domain.mission.model.TodayMission;

@Repository
public class CustomMissionRepositoryImpl implements CustomMissionRepository {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	@Transactional
	public void upsertByMemberId(Long memberId, List<Mission> missions) {
		Query query = new Query(Criteria.where("memberId").is(memberId));
		for(Mission mission : missions) {
			Update update = new Update().push("missions").value(mission);
			mongoTemplate.upsert(query, update, TodayMission.class);
		}
	}
}
