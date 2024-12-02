package com.clio.ondo.domain.chatbot.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Document(collection = "chatting")
@Getter
@AllArgsConstructor
public class ChattingDocument {
	@Id
	public ObjectId id;
	public Long memberId;
	public List<ChatbotChatting> chattings;
}
