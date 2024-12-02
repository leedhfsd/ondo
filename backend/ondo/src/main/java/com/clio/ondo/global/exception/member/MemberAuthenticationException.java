package com.clio.ondo.global.exception.member;

import java.io.Serial;

public class MemberAuthenticationException extends Exception {
	@Serial
	private static final long serialVersionUID = 1L;

	public MemberAuthenticationException() {
		super();
	}

	public MemberAuthenticationException(String message) {
		super(message);
	}

	public MemberAuthenticationException(String message, Throwable cause) {
		super(message, cause);
	}

	public MemberAuthenticationException(Throwable cause) {
		super(cause);
	}
}
