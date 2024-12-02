package com.clio.ondo.domain.mission.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="CompleteMission")
@Getter
@Builder
@AllArgsConstructor
public class CompleteMission {

	@Id
	private ObjectId id;
	private Long memberId;
	private List<Mission> missions;

}
