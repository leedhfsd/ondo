package com.clio.ondo.global.exception.member;

import java.io.Serial;

public class MemberAlreadyExistsException extends RuntimeException {
	@Serial
	private static final long serialVersionUID = 1L;

	public MemberAlreadyExistsException() {
		super();
	}

	public MemberAlreadyExistsException(String message) {
		super(message);
	}

	public MemberAlreadyExistsException(String message, Throwable cause) {
		super(message, cause);
	}

	public MemberAlreadyExistsException(Throwable cause) {
		super(cause);
	}
}
