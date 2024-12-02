package com.clio.ondo.domain.moderation.controller;

import com.clio.ondo.domain.chatbot.model.ChatInput;
import com.clio.ondo.domain.moderation.model.FilteringResponse;
import com.clio.ondo.domain.moderation.model.ModerationRequestDto;
import com.clio.ondo.domain.moderation.service.ModerationService;
import com.clio.ondo.global.ResponseVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ModerationController {
    private final ModerationService moderationService;

    @PostMapping("/moderation")
    public ResponseEntity<?> inspect(@RequestBody Map<String, String> map) {
        try{
            String text = map.get("text");
            List<FilteringResponse> list = moderationService.inspectBadWord(text);
            Map<String, Object> result = new HashMap<>();
            result.put("result", list);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseVO<>(true, "검사 결과", result));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseVO<>(false, "검사 시도 실패", null));
        }
    }
}
