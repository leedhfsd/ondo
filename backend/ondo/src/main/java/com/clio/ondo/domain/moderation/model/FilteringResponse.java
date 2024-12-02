package com.clio.ondo.domain.moderation.model;

import lombok.Builder;
import lombok.Getter;

@Getter
public class FilteringResponse {
    private String attributeName;
    private double score;

    @Builder
    public FilteringResponse(final String attributeName, final double score) {
        this.attributeName = attributeName;
        this.score = score;
    }
}
