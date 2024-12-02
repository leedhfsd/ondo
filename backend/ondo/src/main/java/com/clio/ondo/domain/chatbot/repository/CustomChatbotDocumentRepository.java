package com.clio.ondo.domain.chatbot.repository;

import java.util.List;

import com.clio.ondo.domain.chatbot.model.ChatbotChatting;

public interface CustomChatbotDocumentRepository {
	void upsertByMemberId(Long memberId, ChatbotChatting chatbotChatting);
	List<ChatbotChatting> getChattingsByPage(Long memberId, int page, int size);
}
