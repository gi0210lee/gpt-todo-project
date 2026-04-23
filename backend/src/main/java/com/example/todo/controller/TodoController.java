package com.example.todo.controller;

import com.example.todo.dto.common.ApiResponse;
import com.example.todo.dto.common.PageResponse;
import com.example.todo.dto.todo.TodoRequest;
import com.example.todo.dto.todo.TodoResponse;
import com.example.todo.entity.Priority;
import com.example.todo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ApiResponse<PageResponse<TodoResponse>> getTodos(
            @AuthenticationPrincipal String username,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Priority priority,
            Pageable pageable
    ) {
        Page<TodoResponse> page = todoService.getTodos(username, keyword, completed, priority, pageable);
        return ApiResponse.success(new PageResponse<>(page));
    }

    @PostMapping
    public ApiResponse<TodoResponse> create(@AuthenticationPrincipal String username, @Valid @RequestBody TodoRequest request) {
        return ApiResponse.success(todoService.create(username, request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TodoResponse> update(@PathVariable Long id, @Valid @RequestBody TodoRequest request) {
        return ApiResponse.success(todoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        todoService.delete(id);
        return ApiResponse.success(null);
    }
}
