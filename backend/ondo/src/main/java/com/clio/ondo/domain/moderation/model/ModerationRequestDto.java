package com.clio.ondo.domain.moderation.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class ModerationRequestDto {
    private Comment comment;
    private List<String> languages;
    private Map<String, Attribute> requestedAttributes;

    public ModerationRequestDto(String text) {
        this.comment = new Comment(text);
        this.languages = List.of("ko");

        this.requestedAttributes = new HashMap<>();
        // 유해성, 심한 유해성, 인신공격, 모욕, 비속어, 폭력성
        String[] attributes = {"TOXICITY", "SEVERE_TOXICITY", "IDENTITY_ATTACK", "INSULT", "PROFANITY", "THREAT"};
        Arrays.stream(attributes).forEach(attr -> requestedAttributes.put(attr, new Attribute(0.8)));
    }

    @Data
    static class Comment {
        private String text;

        public Comment(String text) {
            this.text = text;
        }

    }

    @Data
    static class Attribute {
        @JsonProperty("scoreThreshold")
        private double scoreThreshold;

        public Attribute(double scoreThreshold) {
            this.scoreThreshold = scoreThreshold;
        }

    }
}
