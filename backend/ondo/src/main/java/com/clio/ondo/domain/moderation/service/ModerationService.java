package com.clio.ondo.domain.moderation.service;

import com.clio.ondo.domain.moderation.model.FilteringResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ModerationService {
    List<FilteringResponse> inspectBadWord(String text);
}
