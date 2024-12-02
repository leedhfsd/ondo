package com.clio.ondo.domain.mission.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document(collection="TodayMission")
@Getter
@Builder
@AllArgsConstructor
public class TodayMission{

	@Id
	private ObjectId id;
	private Long memberId;
	private List<Mission> missions;
}
