package com.clio.ondo.global.exception.auth;

import java.io.Serial;

public class JwtTokenNotValidException extends RuntimeException {
	@Serial
	private static final long serialVersionUID = 1L;

	public JwtTokenNotValidException() {
		super();
	}

	public JwtTokenNotValidException(String message) {
		super(message);
	}

	public JwtTokenNotValidException(String message, Throwable cause) {
		super(message, cause);
	}

	public JwtTokenNotValidException(Throwable cause) {
		super(cause);
	}
}
