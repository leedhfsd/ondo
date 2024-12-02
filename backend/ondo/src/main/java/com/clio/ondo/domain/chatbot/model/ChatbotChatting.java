package com.clio.ondo.domain.chatbot.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Document
@AllArgsConstructor
@Getter
public class ChatbotChatting {
	@Id
	private ObjectId id;
	private String content;
	private String sender;
	private String createdAt;
	private Long member_id;
}
