package com.clio.ondo.domain.chatbot.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.clio.ondo.domain.chatbot.model.ChattingReadDto;
import com.clio.ondo.domain.mission.model.Mission;
import com.clio.ondo.domain.mission.model.MissionDetail;

public interface ChatbotService {
	// 사용자가 대화를 입력했을 경우 동작하는 함수
	@Transactional
	List<ChattingReadDto> getResponseFromOpenAIChatCompletion(Long memberId, String text);

	// 이전 채팅 내역을 page 단위로 가져오는 함수
	List<ChattingReadDto> getChatbotChattings(Long memberId, int page, int size);

	// 미션을 추천 받는 함수
	@Transactional
	List<MissionDetail> getRecommendFromChatbot(Long memberId, List<Mission> missions);

	//추천 받은 미션을 저장하고 챗봇 메시지 생성하는 부분
	@Transactional
	String createRecommendMessage(Long memberId, List<MissionDetail> recommendedMissions);
}
