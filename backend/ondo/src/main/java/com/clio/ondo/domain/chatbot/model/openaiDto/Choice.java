package com.clio.ondo.domain.chatbot.model.openaiDto;

import lombok.Data;

@Data
public class Choice {
    private int index;
    private ChoiceMessage message;
    private String finishReason;
}


