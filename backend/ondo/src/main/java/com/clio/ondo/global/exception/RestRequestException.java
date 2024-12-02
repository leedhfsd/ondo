package com.clio.ondo.global.exception;

import java.io.Serial;

public class RestRequestException extends RuntimeException {
	@Serial
	private static final long serialVersionUID = 1L;

	public RestRequestException() { super(); }

	public RestRequestException(String message) {
		super(message);
	}

	public RestRequestException(String message, Throwable cause) {
		super(message, cause);
	}

	public RestRequestException(Throwable cause) {
		super(cause);
	}
}
