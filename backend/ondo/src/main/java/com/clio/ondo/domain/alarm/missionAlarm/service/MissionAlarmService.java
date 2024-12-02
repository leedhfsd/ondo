package com.clio.ondo.domain.alarm.missionAlarm.service;

import java.util.ArrayList;
import java.util.List;

import com.clio.ondo.domain.alarm.missionAlarm.model.FCMMessage;
import com.clio.ondo.domain.alarm.missionAlarm.model.FCMNotification;
import com.clio.ondo.domain.alarm.missionAlarm.model.FCMResultDto;
import com.clio.ondo.domain.alarm.missionAlarm.model.FCMSendDto;
import com.clio.ondo.domain.character.model.Character;
import com.clio.ondo.domain.character.service.CharacterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.web.reactive.function.client.WebClient;

import jakarta.annotation.PostConstruct;

@Service
public class MissionAlarmService {
	@Autowired
	private RedisTemplate redisTemplate;
	@Autowired
	private FCMService fcmService;
	@Autowired
	private CharacterService characterService;

	private String url;
	private String accessToken;
	private WebClient webClient;

	@PostConstruct
	public void initSetting(){
		try{
			webClient = WebClient.builder().build();
			url = "https://fcm.googleapis.com/v1/projects/ondo-ffd48/messages:send";
			accessToken = fcmService.getAccessToken();
		}catch(Exception e){

		}
	}


	public List<FCMResultDto> sendFcmAlarm(Long memberId, String message) throws Exception {
		String key = "memberId:" + Long.toString(memberId);

		List<String> tokens = redisTemplate.opsForList().range(key, 0, -1);
		List<FCMResultDto> results = new ArrayList<>();
		Character character = characterService.getCharacters(memberId);
		for(String token : tokens) {
			FCMSendDto fcmSendDto = new FCMSendDto(
				new FCMMessage(token,
					new FCMNotification(message, character.getName())
				));

			ResponseEntity<FCMResultDto> responseBody = webClient.post()
				.uri(url)	// url 정의
				.header("Content-Type", "application/json")
				.header("Authorization", "Bearer " + accessToken)
				.bodyValue(fcmSendDto)	// requestBody 정의
				.retrieve()	// 응답 정의 시작
				.toEntity(FCMResultDto.class)	// 응답 데이터 정의
				.block();	// 동기식 처리

			results.add(responseBody.getBody());
		}

		return results;
	}
}
