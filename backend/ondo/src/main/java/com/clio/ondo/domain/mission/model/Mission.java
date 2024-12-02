package com.clio.ondo.domain.mission.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class Mission {

	//Mission 완료 여부 확인 용
	private boolean completeFlag; //완료여부
	private LocalDateTime completeTime; //완료시간

	//MissionDetail의 내용
	private String title; //제목
	private String content; //내용
	private String type; //데일리 or 특별
	private int exp; //경험치
	private int level; //단계

	@Override
	public String toString() {
		return content;
	}
}
