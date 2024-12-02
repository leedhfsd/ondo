package com.clio.ondo.domain.moderation.service;

import com.clio.ondo.domain.moderation.model.FilteringResponse;
import com.clio.ondo.domain.moderation.model.ModerationRequestDto;
import com.clio.ondo.domain.moderation.model.ModerationResponseDto;
import com.clio.ondo.global.exception.RestRequestException;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@PropertySource("classpath:perspectiveapi.properties")
public class ModerationServiceImpl implements ModerationService {
    @Value("${api.key}")
    private String key;

    @Override
    public List<FilteringResponse> inspectBadWord(String text) {
        try{
            WebClient webClient = WebClient.builder().build();
            String url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=" + key;

            ModerationRequestDto moderationRequestDto = new ModerationRequestDto(text);

            ResponseEntity<ModerationResponseDto> responseBody = webClient.post()
                .uri(url)	// url 정의
                .bodyValue(moderationRequestDto)	// requestBody 정의
                .retrieve()	// 응답 정의 시작
                .toEntity(ModerationResponseDto.class)	// 응답 데이터 정의
                .block();	// 동기식 처리

            ModerationResponseDto moderationResponseDto = responseBody.getBody();
            List<FilteringResponse> responseList = new ArrayList<>();

            if(moderationResponseDto.getAttributeScores() != null) {
                for(Map.Entry<String, ModerationResponseDto.AttributeScores> entry : moderationResponseDto.getAttributeScores().entrySet()){
                    String attributeName = entry.getKey();
                    double summaryScoreValue = entry.getValue().getSummaryScore().getValue();

                    FilteringResponse moderationResponse = FilteringResponse.builder()
                        .attributeName(attributeName)
                        .score(summaryScoreValue)
                        .build();
                    responseList.add(moderationResponse);
                }
            }

            Collections.sort(responseList, (a, b) -> {
                return (int)(b.getScore() - a.getScore());
            });

            return responseList;
        }catch(Exception e){
            e.printStackTrace();
            throw new RestRequestException("PerspectiveAPI 서버와 연결에 실패했습니다.");
        }
    }
}
