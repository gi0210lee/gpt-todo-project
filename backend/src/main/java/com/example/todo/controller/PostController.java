package com.example.todo.controller;

import com.example.todo.dto.common.ApiResponse;
import com.example.todo.dto.common.PageResponse;
import com.example.todo.dto.post.PostCreateRequest;
import com.example.todo.dto.post.PostResponse;
import com.example.todo.dto.post.PostSearchCondition;
import com.example.todo.dto.post.PostUpdateRequest;
import com.example.todo.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ApiResponse<PageResponse<PostResponse>> getPosts(PostSearchCondition condition, @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PostResponse> posts = postService.getPosts(condition, pageable);
        return ApiResponse.success(new PageResponse<>(posts));
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long id) {
        PostResponse postResponse = postService.getPost(id);
        return ApiResponse.success(postResponse);
    }

    @PostMapping
    public ApiResponse<PostResponse> createPost(@Valid @RequestBody PostCreateRequest request, @AuthenticationPrincipal String username) {
        PostResponse postResponse = postService.createPost(request, username);
        return ApiResponse.success(postResponse);
    }

    @PutMapping("/{id}")
    public ApiResponse<PostResponse> updatePost(@PathVariable Long id, @Valid  @RequestBody PostUpdateRequest request, @AuthenticationPrincipal String username) {
        PostResponse postResponse = postService.updatePost(id, request, username);
        return ApiResponse.success(postResponse);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePost(@PathVariable Long id, @AuthenticationPrincipal String username) {
        postService.deletePost(id, username);
        return ApiResponse.success(null);
    }
}
