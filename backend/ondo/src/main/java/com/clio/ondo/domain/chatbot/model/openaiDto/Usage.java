package com.clio.ondo.domain.chatbot.model.openaiDto;

import lombok.Data;

@Data
public class Usage {
    private int promptTokens;
    private int completionTokens;
    private int totalTokens;
}