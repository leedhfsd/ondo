package com.clio.ondo.domain.moderation.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ModerationResponseDto {
    private Map<String, AttributeScores> attributeScores;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AttributeScores {
        @JsonProperty("spanScores")
        private List<SpanScore> spanScores;
        @JsonProperty("summaryScore")
        private Score summaryScore;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SpanScore {
        private int begin;
        private int end;
        private Score score;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Score {
        private double value;
        private String type;
    }
}
