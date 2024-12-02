
package com.clio.ondo.domain.chat;

import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

@Data
@RedisHash("ChatMessage")
public class ChatMessage {
    private String sessionId;
    private String from;
    private String content;

    public ChatMessage() {
    }

    public ChatMessage(String sessionId, String from, String content) {
        this.sessionId = sessionId;
        this.from = from;
        this.content = content;
    }

    // getters and setters

    @Override
    public String toString() {
        return "ChatMessage{" +
                "sessionId='" + sessionId + '\'' +
                ", from='" + from + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}