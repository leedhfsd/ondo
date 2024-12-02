package com.clio.ondo.global;

import org.hibernate.PropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	// @RequestBody에 값이 올바르게 들어오지 않는 경우
	@ExceptionHandler(PropertyValueException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ResponseEntity<String> handlePropertyValueException(PropertyValueException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Property value error}");
	}

}