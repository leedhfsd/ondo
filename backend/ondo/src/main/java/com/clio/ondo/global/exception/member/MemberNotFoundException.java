package com.clio.ondo.global.exception.member;

import java.io.Serial;

public class MemberNotFoundException extends RuntimeException {
	@Serial
	private static final long serialVersionUID = 1L;

	public MemberNotFoundException() {
		super();
	}

	public MemberNotFoundException(String message) {
		super(message);
	}

	public MemberNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	public MemberNotFoundException(Throwable cause) {
		super(cause);
	}
}
