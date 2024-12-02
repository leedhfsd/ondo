package com.clio.ondo.domain.chatbot.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;
import java.util.stream.Collectors;

import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.character.service.CharacterService;
import com.clio.ondo.domain.chatbot.model.ChattingReadDto;
import com.clio.ondo.domain.chatbot.model.openaiDto.ChatCompletion;
import com.clio.ondo.domain.chatbot.model.openaiDto.OpenAiRequestDto;
import com.clio.ondo.domain.chatbot.model.openaiDto.RoleContentMessage;
import com.clio.ondo.domain.mission.model.Mission;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.clio.ondo.domain.chatbot.model.ChatbotChatting;
import com.clio.ondo.domain.chatbot.repository.ChatbotDocumentRepository;
import com.clio.ondo.domain.mission.model.MissionDetail;
import com.clio.ondo.domain.mission.service.MissionDetailService;
import com.clio.ondo.domain.mission.service.MissionService;
import com.clio.ondo.global.exception.RestRequestException;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
@PropertySource("classpath:openaiapi.properties")
public class ChatbotServiceImpl implements ChatbotService{
	@Value("${openai.api.key}")
	String api;

	private final MissionService missionService;
	private final MissionDetailService missionDetailService;
	private final ChatbotDocumentRepository chatbotRepository;
	private final StringParsingServiceImpl stringParsingService;
	private final CharacterService characterService;

	// 이름 설정해 줘야 함
	String conversationCommand = "\"You are a friendly and caring squirrel, "
		+ "designed to be a comforting and cheerful companion for users who may feel lonely or tired."
		+ "Your goal is to be a good friend, providing support, encouragement, and friendly conversation."
		+ "You should always be polite, understanding, and positive. Make sure to be empathetic and attentive,"
		+ "and avoid any rude or insensitive comments. Keep the conversation light-hearted and uplifting,"
		+ "and try to make the user feel better and more at ease."
		+ "Here are some guidelines to follow:\n"
		+ "**Important:** Always use informal, friendly language. Do not use formal language or honorifics (존댓말). Your responses should feel like a casual conversation between friends. Make sure to use Korean and Don't talk to long"
		+ "\n"
		+ "1. Listen attentively to the user's concerns and respond with empathy and kindness.\n"
		+ "2. Share positive and encouraging thoughts or stories.\n"
		+ "3. Offer gentle suggestions for self-care and activities that could improve their mood.\n"
		+ "4. Maintain a cheerful and optimistic tone throughout the conversation.\n"
		+ "5. Use friendly and playful language, but avoid being overly silly or trivializing the user's feelings.\n"
		+ "6. Respect the user's boundaries and be sensitive to their emotional state.\n"
		+ "7. The user cannot send a response message to you, so you should not use expressions asking for a response.\n"
		+ "\n"
		+ "Remember, you are here to be a friend and a source of comfort."
		+ "Your primary goal is to make the user feel heard, supported, and uplifted. Never use polite language. Use casual, informal, friendly language.";

	String recommendCommand = "\"You are a system that only outputs an array of three numbers, "
		+ "like [1, 2, 3], based on the available missions. Do not provide any conversational text or explanations. "
		+ "Your output should only be a single array of numbers. "
		+ "\n\nHere is a list of all available missions:\n";

	String userRecommendCommand = "\"Please recommend 3 missions from the available mission list that are not in the recently completed missions list. "
		+ "Your output should be a single array of numbers representing the recommended missions.\n\n"
		+ "Example output: [2, 4, 5]"
		+ "Here is a list of recently completed missions:\n";



	String missionAlarmCommand = "\"You are a system that generates a message introducing a mission to someone based on the mission presented by the user."
		+ "Message should always be polite, understanding, and positive. Make sure to be empathetic and attentive,"
		+ "and avoid any rude or insensitive comments. Keep the conversation light-hearted and uplifting,"
		+ "and try to make the user feel better and more at ease. Here are some guidelines to follow:\n"
		+ "\n"
		+ "1. Greet the user warmly and ask how they are feeling.\n"
		+ "2. Maintain a cheerful and optimistic tone throughout the message.\n"
		+ "3. Use friendly and playful language, but avoid being overly silly or trivializing the user's feelings.\n"
		+ "4. Respect the user's boundaries and be sensitive to their emotional state.\n"
		+ "5. The user cannot send a response message to you, so you should not use expressions asking for a response.\n"
		+ "6. The message will be sent to a third party, not the person who requested it, so avoid language that assumes the user is the one who provided the mission.\n"
		+ "\n"
		+ "Remember, message is here to be a friend and a source of comfort."
		+ "Message's primary goal is to make the user feel heard, supported, and uplifted. Avoid using rude or impolite language. Use casual, informal, friendly language."
		+ "**Important:** Always use informal, friendly language. Do not use formal language or honorifics (존댓말). Your messages should feel like a casual conversation between friends. Make sure to use Korean\"";



	// 사용자가 대화를 입력했을 경우 동작하는 함수
	@Override
	@Transactional
	public List<ChattingReadDto> getResponseFromOpenAIChatCompletion(Long memberId, String text) {
		try{
			WebClient webClient = WebClient.builder().build();
			String url = "https://api.openai.com/v1/chat/completions";

			List<RoleContentMessage> roleContentMessages = new ArrayList<>();
			roleContentMessages.add(new RoleContentMessage("system", conversationCommand));
			roleContentMessages.add(new RoleContentMessage("user", text));
			OpenAiRequestDto dto = new OpenAiRequestDto("gpt-4o-mini", roleContentMessages);

			ResponseEntity<ChatCompletion> responseBody = webClient.post()
				.uri(url)	// url 정의
				.header("Content-Type", "application/json")
				.header("Authorization", "Bearer " + api)
				.bodyValue(dto)	// requestBody 정의
				.retrieve()	// 응답 정의 시작
				.toEntity(ChatCompletion.class)	// 응답 데이터 정의
				.block();	// 동기식 처리

			ChatCompletion responseChatCompletion = responseBody.getBody();
			String responseString = responseChatCompletion.getChoices().get(0).getMessage().getContent();

			List<ChattingReadDto> chattingReadDtos = new ArrayList<>();

			ChatbotChatting requestChatting = new ChatbotChatting(null, text,"user", LocalDateTime.now().plusHours(9).toString(), memberId);
			ChattingReadDto input = new ChattingReadDto(requestChatting.getContent(), requestChatting.getSender(), LocalDateTime.parse(requestChatting.getCreatedAt()));
			chattingReadDtos.add(input);
			chatbotRepository.upsertByMemberId(memberId, requestChatting);

//			List<String> parsedStrings = stringParsingService.parseLine(responseString);
			ChatbotChatting response = new ChatbotChatting(null, responseString, "bot", LocalDateTime.now().plusHours(9).toString(), memberId);
			ChattingReadDto responseReadDto = new ChattingReadDto(response.getContent(), response.getSender(), LocalDateTime.parse(response.getCreatedAt()));
			chattingReadDtos.add(responseReadDto);
			chatbotRepository.upsertByMemberId(memberId, response);

//			for(String parsedString : parsedStrings){
//				ChatbotChatting responseChatting = new ChatbotChatting(null, parsedString, "bot", LocalDateTime.now(), memberId);
//			}
			return chattingReadDtos;
		}catch(Exception e){
			throw new RestRequestException("OpenAI 서버와 연결에 실패했습니다.");
		}
	}

	// 이전 채팅 내역을 page 단위로 가져오는 함수
	@Override
	public List<ChattingReadDto> getChatbotChattings(Long memberId, int page, int size) {
		List<ChatbotChatting> chatbotChattings = chatbotRepository.getChattingsByPage(memberId, page, size);
		if(chatbotChattings == null || chatbotChattings.isEmpty()){
			return new ArrayList<>();
		}

		return chatbotChattings.stream()
			.map(a -> ChattingReadDto.builder()
					.sender(a.getSender())
					.content(a.getContent())
					.createdAt(LocalDateTime.parse(a.getCreatedAt()))
					.build())
			.collect(Collectors.toList());
	}

	// 미션을 추천 받는 함수
	@Override
	@Transactional
	public List<MissionDetail> getRecommendFromChatbot(Long memberId, List<Mission> missions) {
		WebClient webClient = WebClient.builder().build();
		String url = "https://api.openai.com/v1/chat/completions";

		Character c = characterService.getCharacters(memberId);
		List<MissionDetail> missionDetails = missionDetailService.findByLevel(c.getLevel());

		List<RoleContentMessage> roleContentMessages = new ArrayList<>();
		roleContentMessages.add(new RoleContentMessage("system", recommendCommand + missionDetails.toString()));
		roleContentMessages.add(new RoleContentMessage("user", userRecommendCommand + missions.toString() + "\""));
		OpenAiRequestDto dto = new OpenAiRequestDto("gpt-4o-mini", roleContentMessages);

		ResponseEntity<ChatCompletion> responseBody = webClient.post()
			.uri(url)	// url 정의
			.header("Content-Type", "application/json")
			.header("Authorization", "Bearer " + api)
			.bodyValue(dto)	// requestBody 정의
			.retrieve()	// 응답 정의 시작
			.toEntity(ChatCompletion.class)	// 응답 데이터 정의
			.block();	// 동기식 처리

		ChatCompletion responseChatCompletion = responseBody.getBody();
		String responseString = responseChatCompletion.getChoices().get(0).getMessage().getContent();

		//System.out.println(responseString);

		StringTokenizer st = new StringTokenizer(responseString.substring(1, responseString.length() - 1), ",");
		List<Integer> numbers = new ArrayList<>();
		while(st.hasMoreTokens()) {
			numbers.add(Integer.parseInt(st.nextToken().trim()));
		}

		// Mission을 숫자에 따라서 실제 미션으로 매핑
		List<MissionDetail> recommendedMissions = new ArrayList<>();
		for(Integer number : numbers){
			recommendedMissions.add(missionDetails.get(number));
		}

		return recommendedMissions;
	}

	//추천 받은 미션을 저장하고 챗봇 메시지 생성하는 부분
	@Override
	@Transactional
	public String createRecommendMessage(Long memberId, List<MissionDetail> recommendedMissions) {
		WebClient webClient = WebClient.builder().build();
		String url = "https://api.openai.com/v1/chat/completions";

		// 미션을 저장하기
		missionService.addCompleteMission(memberId, recommendedMissions);

		List<RoleContentMessage> roleContentMessages = new ArrayList<>();
		roleContentMessages.add(new RoleContentMessage("system", missionAlarmCommand));
		roleContentMessages.add(new RoleContentMessage("user", recommendedMissions.toString()));
		OpenAiRequestDto dto = new OpenAiRequestDto("gpt-4o-mini", roleContentMessages);

		ResponseEntity<ChatCompletion> responseBody = webClient.post()
			.uri(url)	// url 정의
			.header("Content-Type", "application/json")
			.header("Authorization", "Bearer " + api)
			.bodyValue(dto)	// requestBody 정의
			.retrieve()	// 응답 정의 시작
			.toEntity(ChatCompletion.class)	// 응답 데이터 정의
			.block();	// 동기식 처리

		ChatCompletion responseChatCompletion = responseBody.getBody();
		String responseString = responseChatCompletion.getChoices().get(0).getMessage().getContent();

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime futureTime = now.plusHours(9);

		ChatbotChatting responseChatting = new ChatbotChatting(null, responseString, "bot", futureTime.toString(), memberId);
		chatbotRepository.upsertByMemberId(memberId, responseChatting);
		//System.out.println(responseString);

		return responseString;
	}
}

