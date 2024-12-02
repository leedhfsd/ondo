package com.clio.ondo.domain.chatbot.model.openaiDto;

import lombok.Data;

@Data
public class ChoiceMessage {
    private String role;
    private String content;
}
