package com.clio.ondo.domain.alarm.missionAlarm.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FCMMessage {
	private String token;
	private FCMNotification data;
}
