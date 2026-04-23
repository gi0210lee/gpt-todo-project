package com.example.todo.service;

import com.example.todo.dto.post.PostCreateRequest;
import com.example.todo.dto.post.PostResponse;
import com.example.todo.dto.post.PostSearchCondition;
import com.example.todo.dto.post.PostUpdateRequest;
import com.example.todo.entity.Post;
import com.example.todo.entity.User;
import com.example.todo.exception.BusinessException;
import com.example.todo.exception.ErrorCode;
import com.example.todo.repository.PostRepository;
import com.example.todo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Page<PostResponse> getPosts(PostSearchCondition condition, Pageable pageable) {
//        Page<Post> page = postRepository.findAll(pageable);
//        return page.map(PostResponse::from);

        Page<Post> page = postRepository.search(condition, pageable);
        return page.map(PostResponse::from);
    }

    public PostResponse createPost(PostCreateRequest request, String username) {
        User author = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(author);
        post.setViewCount(0);

        Post savedPost = postRepository.save(post);
        return PostResponse.from(savedPost);
    }

    public PostResponse updatePost(Long id, PostUpdateRequest request, String username) {
        Post post = postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        return PostResponse.from(post);
    }

    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        postRepository.delete(post);
    }


    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));
        post.setViewCount(post.getViewCount() + 1);

        Post savedPost = postRepository.save(post);
        return PostResponse.from(savedPost);
    }
}
