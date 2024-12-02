package com.clio.ondo.global.exception.board;

import java.io.Serial;

public class ModerationException extends RuntimeException{
	@Serial
	private static final long serialVersionUID = 1L;

	public ModerationException() { super(); }

	public ModerationException(String message) {
		super(message);
	}

	public ModerationException(String message, Throwable cause) {
		super(message, cause);
	}

	public ModerationException(Throwable cause) {
		super(cause);
	}
}
