package com.example.todo.repository;

import com.example.todo.entity.Priority;
import com.example.todo.entity.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TodoRepositoryCustom {
    Page<Todo> findAllByFilters(String username, String keyword, Boolean Completed, Priority priority, Pageable pageable);
}
