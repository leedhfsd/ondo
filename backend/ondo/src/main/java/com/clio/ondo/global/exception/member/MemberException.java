package com.clio.ondo.global.exception.member;

import java.io.Serial;

public class MemberException extends RuntimeException {
	@Serial
	private static final long serialVersionUID = 1L;

	public MemberException() {
		super();
	}

	public MemberException(String message) {
		super(message);
	}

	public MemberException(String message, Throwable cause) {
		super(message, cause);
	}

	public MemberException(Throwable cause) {
		super(cause);
	}
}
