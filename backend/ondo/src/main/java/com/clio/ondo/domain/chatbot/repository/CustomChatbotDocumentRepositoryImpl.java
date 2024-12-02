package com.clio.ondo.domain.chatbot.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.clio.ondo.domain.chatbot.model.ChatbotChatting;
import com.clio.ondo.domain.chatbot.model.ChattingDocument;

@Repository
public class CustomChatbotDocumentRepositoryImpl implements CustomChatbotDocumentRepository {

	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public void upsertByMemberId(Long memberId, ChatbotChatting chatbotChatting) {
		Query query = new Query(Criteria.where("memberId").is(memberId));
		Update update = new Update().push("chattings").atPosition(0).value(chatbotChatting);
		mongoTemplate.upsert(query, update, ChattingDocument.class);
	}

	@Override
	public List<ChatbotChatting> getChattingsByPage(Long memberId, int page, int size){
		Query query = new Query(Criteria.where("memberId").is(memberId));
		query.fields().slice("chattings", page*size, size);
		ChattingDocument result = mongoTemplate.findOne(query, ChattingDocument.class);
		return result != null ? result.getChattings() : null;
	}
}