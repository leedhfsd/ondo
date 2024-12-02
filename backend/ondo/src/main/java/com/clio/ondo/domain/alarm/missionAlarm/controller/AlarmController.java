package com.clio.ondo.domain.alarm.missionAlarm.controller;

import com.clio.ondo.domain.alarm.missionAlarm.model.FCMToken;
import com.clio.ondo.domain.alarm.missionAlarm.service.FCMService;
import com.clio.ondo.domain.alarm.missionAlarm.service.MissionAlarmService;
import com.clio.ondo.domain.alarm.missionAlarm.service.ScheduledAlarmService;
import com.clio.ondo.domain.chatbot.controller.ChatbotController;
import com.clio.ondo.domain.chatbot.model.ChattingReadDto;
import com.clio.ondo.global.ResponseVO;
import com.clio.ondo.global.auth.jwtUtil.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AlarmController {
    private final ScheduledAlarmService scheduledAlarmService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/api/v1/alarm/fcmtoken")
    public ResponseEntity<?> setToken(HttpServletRequest request, @RequestBody FCMToken fcmtoken) {
        try{
            String token = jwtTokenProvider.getJwtTokenFromCookies(request, "accessToken");
            Long id = jwtTokenProvider.getIdFromToken(token);
            scheduledAlarmService.saveToken(id, fcmtoken);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseVO<>(true, "토큰 저장 성공", null));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseVO<>(false, "토큰 저장 실패", null));
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
