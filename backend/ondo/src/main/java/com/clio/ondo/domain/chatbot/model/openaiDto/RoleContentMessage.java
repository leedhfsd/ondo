package com.clio.ondo.domain.chatbot.model.openaiDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoleContentMessage {
    private String role;
    private String content;
}
