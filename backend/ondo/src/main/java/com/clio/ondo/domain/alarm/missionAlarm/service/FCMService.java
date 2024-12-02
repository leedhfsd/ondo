package com.clio.ondo.domain.alarm.missionAlarm.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Service
public class FCMService {
	private final String[] SCOPES = {"https://www.googleapis.com/auth/firebase.messaging"};

	public String getAccessToken() throws IOException {
		ClassPathResource resource = new ClassPathResource("firebase.json");

		GoogleCredentials googleCredentials = GoogleCredentials
			.fromStream(resource.getInputStream())
			.createScoped(Arrays.asList(SCOPES));
		googleCredentials.refreshIfExpired();  // refreshIfExpired로 토큰 갱신
		googleCredentials.refreshAccessToken();
		return googleCredentials.getAccessToken().getTokenValue();
	}
}
