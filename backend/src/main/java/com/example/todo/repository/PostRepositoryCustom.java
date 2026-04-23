package com.example.todo.repository;

import com.example.todo.dto.post.PostSearchCondition;
import com.example.todo.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostRepositoryCustom {
    Page<Post> search(PostSearchCondition condition, Pageable pageable);
}
