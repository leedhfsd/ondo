
package com.clio.ondo.domain.chat;
import com.clio.ondo.domain.chat.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ChatController {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void send(ChatMessage message) throws Exception {
//        Thread.sleep(100); // simulated delay
        String sessionId = HtmlUtils.htmlEscape(message.getSessionId());
        String from = HtmlUtils.htmlEscape(message.getFrom());
        String content = HtmlUtils.htmlEscape(message.getContent());

        ChatMessage savedMessage = new ChatMessage(sessionId, from, content);
        String messageJson = new ObjectMapper().writeValueAsString(savedMessage);

        redisTemplate.opsForList().rightPush("chatRoom:" + sessionId, messageJson);

        messagingTemplate.convertAndSend("/topic/messages/" + sessionId, savedMessage);
    }

    @GetMapping("/history/{sessionId}")
    public List<ChatMessage> fetchHistory(@PathVariable String sessionId) throws Exception {
        String escapedSesionId = HtmlUtils.htmlEscape(sessionId);
        List<String> messages = redisTemplate.opsForList().range("chatRoom:" +escapedSesionId , 0, -1);
        return messages.stream()
                .map(this::convertJsonToChatMessage)
                .collect(Collectors.toList());
    }

    private ChatMessage convertJsonToChatMessage(String json) {
        try {
            return new ObjectMapper().readValue(json, ChatMessage.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON string to ChatMessage", e);
        }
    }
}
