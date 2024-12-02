package com.clio.ondo.global;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class ResponseVO<T> {
	private boolean success;
	private String message;
	private Map<String, T> data;

	public ResponseVO() {
	}

	public ResponseVO(boolean success, String message, Map<String, T> data) {
		this.success = success;
		this.message = message;
		this.data = data;
	}

	public static <T> ResponseVO<T> success(String message) {
		return new ResponseVO<>(true, message, null);
	}

	public static <T> ResponseVO<T> success(String message, String name, T data) {
		Map<String, T> dataMap = new HashMap<>();
		dataMap.put(name, data);
		return new ResponseVO<>(true, message, dataMap);
	}

	public static <T> ResponseVO<T> success(String name, T data) {
		Map<String, T> dataMap = new HashMap<>();
		dataMap.put(name, data);
		return new ResponseVO<>(true, "Success", dataMap);
	}

	public static <T> ResponseVO<T> failure(String message) {
		return new ResponseVO<>(false, message, null);
	}
}
