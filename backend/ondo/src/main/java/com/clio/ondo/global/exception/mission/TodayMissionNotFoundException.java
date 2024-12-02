package com.clio.ondo.global.exception.mission;

// 커스텀 예외 클래스 정의
	public class TodayMissionNotFoundException extends RuntimeException {
		public TodayMissionNotFoundException(String message) {
			super(message);
		}
	}
