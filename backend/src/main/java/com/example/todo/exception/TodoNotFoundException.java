package com.example.todo.exception;

public class TodoNotFoundException extends BusinessException {

    public TodoNotFoundException() {
        super(ErrorCode.TODO_NOT_FOUND);
    }
}
