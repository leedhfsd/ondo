package com.clio.ondo.domain.chatbot.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.clio.ondo.domain.chatbot.model.ChatInput;
import com.clio.ondo.domain.chatbot.model.ChattingReadDto;
import com.clio.ondo.domain.chatbot.model.openaiDto.ChatCompletion;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clio.ondo.domain.chatbot.model.ChatbotChatting;
import com.clio.ondo.domain.chatbot.service.ChatbotServiceImpl;
import com.clio.ondo.global.exception.RestRequestException;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatbotController {
	private final ChatbotServiceImpl chatbotService;
	private final JwtTokenProvider jwtTokenProvider;

	@PostMapping("/api/v1/chatbot/insert")
	public ResponseEntity<?> insert(HttpServletRequest request, @RequestBody ChatInput chatInput) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);
			List<ChattingReadDto> responseChatting = chatbotService.getResponseFromOpenAIChatCompletion(id, chatInput.getMessage());
			Map<String, Object> result = new HashMap<>();
			result.put("responseChatting", responseChatting);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ResponseVO<>(true, "채팅 입력 성공", result));
		}catch(RestRequestException rre){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, rre.getMessage(), null));
		}
		catch(Exception e){
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseVO<>(false, "채팅 입력 실패", null));
		}
	}

	@GetMapping("/api/v1/chatbot/list")
	public ResponseEntity<?> read(HttpServletRequest request, @RequestParam int page, @RequestParam int size) {
		try{
			String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
			Long id = jwtTokenProvider.getIdFromToken(token);
			List<ChattingReadDto> chattingList = chatbotService.getChatbotChattings(id, page, size);

			Map<String, Object> result = new HashMap<>();
			result.put("chattingList", chattingList);

			return ResponseEntity.status(HttpStatus.OK)
					.body(new ResponseVO<>(true, "채팅 기록 조회 성공", result));
		}catch(Exception e){
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ResponseVO<>(false, "채팅 기록 조회 실패", null));
		}
	}

	@Data
	@Builder
	static class Result<T> {
		boolean success;
		int status;
		T data;
	}
}
