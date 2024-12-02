package com.clio.ondo.global.exception.counselor;

import java.io.Serial;

public class CounselorAlreadyExistsException extends RuntimeException {
	@Serial
	private static final long serialVersionUID = 1L;

	public CounselorAlreadyExistsException() {
		super();
	}

	public CounselorAlreadyExistsException(String message) {
		super(message);
	}

	public CounselorAlreadyExistsException(String message, Throwable cause) {
		super(message, cause);
	}

	public CounselorAlreadyExistsException(Throwable cause) {
		super(cause);
	}
}