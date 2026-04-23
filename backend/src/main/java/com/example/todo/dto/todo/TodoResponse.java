package com.example.todo.dto.todo;

import com.example.todo.entity.Priority;
import com.example.todo.entity.Todo;

import java.time.LocalDateTime;

public class TodoResponse {
    private Long id;
    private String title;
    private boolean completed;
    private Priority priority;
    private LocalDateTime dueDate;


    public TodoResponse() {
    }

    public TodoResponse(Long id, String title, boolean completed, Priority priority, LocalDateTime dueDate) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public static TodoResponse from(Todo todo) {
        TodoResponse res = new TodoResponse();
        res.setId(todo.getId());
        res.setTitle(todo.getTitle());
        res.setCompleted(todo.isCompleted());
        res.setPriority(todo.getPriority());
        res.setDueDate(todo.getDueDate());
        return res;
    }
}
