package com.example.todo.service;

import com.example.todo.entity.Priority;
import com.example.todo.entity.QTodo;
import com.example.todo.entity.Todo;
import com.example.todo.entity.User;
import com.example.todo.dto.todo.TodoRequest;
import com.example.todo.dto.todo.TodoResponse;
import com.example.todo.exception.GlobalExceptionHandler;
import com.example.todo.exception.TodoNotFoundException;
import com.example.todo.repository.TodoRepository;
import com.example.todo.repository.UserRepository;
import com.querydsl.core.BooleanBuilder;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

//    public Page<TodoResponse> getTodos(String username, String keyword, Pageable pageable) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("None user"));
//
//        Page<Todo> page;
//
//        if (keyword == null || keyword.isEmpty()) {
//            page = todoRepository.findByUser(user, pageable);
//        } else {
//            page = todoRepository.findByUserAndTitleContaining(user, keyword, pageable);
//        }
//
//        return page.map(TodoResponse::from);
//    }

    public Page<TodoResponse> getTodos(String username, String keyword, Boolean completed, Priority priority, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("None user"));
        Page<Todo> page = todoRepository.findAllByFilters(username, keyword, completed, priority, pageable);
        return page.map(TodoResponse::from);
    }

    public TodoResponse create(String username, TodoRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException());
        Todo todo = new Todo(request.getTitle(), user);
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());
        Todo saved = todoRepository.save(todo);

        return TodoResponse.from(saved);
    }

    public TodoResponse update(Long id, TodoRequest request) {
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new TodoNotFoundException());

        if (request.getTitle() != null) {
            todo.setTitle(request.getTitle());
        }
        if (request.getPriority() != null) {
            todo.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            todo.setDueDate(request.getDueDate());
        }

        todo.setCompleted(request.isCompleted());
        todoRepository.save(todo);

        return TodoResponse.from(todo);
    }

    public void delete(Long id) {
        if (!todoRepository.existsById(id)) throw new TodoNotFoundException();

        todoRepository.deleteById(id);
    }
}
