package com.clio.ondo.domain.alarm.missionAlarm.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FCMNotification {
	private String body;
	private String title;
}