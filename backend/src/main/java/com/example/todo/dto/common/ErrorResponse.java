package com.example.todo.dto.common;

import com.example.todo.exception.ErrorCode;
import org.springframework.validation.FieldError;

public class ErrorResponse {
    private final int status;
    private final String code;
    private final String message;

    private ErrorResponse(ErrorCode errorCode)
    {
        this.status = errorCode.getStatus();
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(errorCode);
    }

    public int getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
