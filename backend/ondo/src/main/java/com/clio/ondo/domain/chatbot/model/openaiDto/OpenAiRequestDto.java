package com.clio.ondo.domain.chatbot.model.openaiDto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OpenAiRequestDto {
    private String model;
    private List<RoleContentMessage> messages;
}