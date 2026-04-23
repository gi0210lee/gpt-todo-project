package com.example.todo.dto.post;

import jakarta.validation.constraints.NotBlank;

public class PostUpdateRequest {
    @NotBlank(message = "제목은 필수 입니다")
    private String title;

    @NotBlank(message = "내용은 필수 입니다")
    private String content;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
