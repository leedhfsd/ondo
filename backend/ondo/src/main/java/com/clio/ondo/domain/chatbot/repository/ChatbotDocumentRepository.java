package com.clio.ondo.domain.chatbot.repository;

import org.bson.types.ObjectId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.chatbot.model.ChatbotChatting;
import com.clio.ondo.domain.chatbot.model.ChattingDocument;

import java.util.List;

public interface ChatbotDocumentRepository extends MongoRepository<ChattingDocument, ObjectId>, CustomChatbotDocumentRepository {
	@Query(value = "{ 'memberId': ?0 }")
	List<ChattingDocument> findByMemberId(Long memberId);
}
