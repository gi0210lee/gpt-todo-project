package com.example.todo.exception;

public enum ErrorCode {
    // common
    INVALID_INPUT_VALUE(400, "C001", "잘못된 입력값입니다."),
    INTERVAL_SERVER_ERROR(500, "C002", "서버 내부 오류가 발생했습니다."),

    // auth
    INVALID_TOKEN(401, "A001", "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(402, "A002", "만료된 토큰 입니다."),
    HANDLE_ACCESS_DENIED(403, "A003", "권한이 없습니다."),

    // todo
    TODO_NOT_FOUND(404, "T001", "해당 Todo를 찾을 수 없습니다."),
    ;

    private final int status;
    private final String code;
    private final String message;

    ErrorCode(int status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
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
