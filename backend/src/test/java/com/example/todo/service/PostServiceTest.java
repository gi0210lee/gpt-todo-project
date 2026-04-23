package com.example.todo.service;

import com.example.todo.dto.post.PostCreateRequest;
import com.example.todo.dto.post.PostResponse;
import com.example.todo.dto.post.PostSearchCondition;
import com.example.todo.dto.post.PostUpdateRequest;
import com.example.todo.entity.Post;
import com.example.todo.entity.User;
import com.example.todo.exception.BusinessException;
import com.example.todo.repository.PostRepository;
import com.example.todo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.willReturn;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PostService postService;

    @Test
    @DisplayName("게시글 상세 조회 시 조회수가 1 증가해야한다")
    void getPost_success() {
        Long postId = 1L;
        Post post = new Post();
        post.setId(postId);
        post.setTitle("테스트 제목");
        post.setContent("테스트 내용");
        post.setViewCount(10);

        User author = new User();
        author.setUsername("testuser");
        post.setAuthor(author);

        // findById가 호출 되면 위에서 만든 post 반환
        given(postRepository.findById(postId)).willReturn(Optional.of(post));

        // save 호출 시 post 반환
        given(postRepository.save(any(Post.class))).willReturn(post);

        PostResponse response = postService.getPost(postId);

        assertThat(response.getTitle()).isEqualTo("테스트 제목");
        assertThat(post.getViewCount()).isEqualTo(11);

        verify(postRepository).save(post);
    }

    @Test
    @DisplayName("존재하지 않는 게시글 조회 시 EntityNotFoundException 발생")
    void getPost_fail_notFound() {
        Long postId = 99L;
        given(postRepository.findById(postId)).willReturn(Optional.empty());

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            postService.getPost(postId);
        });
    }

    @Test
    @DisplayName("본인의 게시글은 제목과 내용을 수정할 수 있다")
    void updatePost_success() {
        Long postId = 1L;
        String username = "testuser";
        PostUpdateRequest request = new PostUpdateRequest();
        request.setTitle("수정된 제목");
        request.setContent("수정된 내용");

        User author = new User();
        author.setUsername(username);

        Post post = new Post();
        post.setId(postId);
        post.setAuthor(author);

        // findById가 호출 되면 위에서 만든 post 반환
        given(postRepository.findById(postId)).willReturn(Optional.of(post));

        PostResponse response = postService.updatePost(postId, request, username);

        assertThat(response.getTitle()).isEqualTo("수정된 제목");
        assertThat(post.getContent()).isEqualTo("수정된 내용");
    }

    @Test
    @DisplayName("다른 사람이 게시글을 수정하려 하면 BusinessException 발생")
    void updatePost_fail_notAuther() {
        Long postId = 1L;
        String authorUsername = "testuser";
        String otherUsername = "otheruser";

        PostUpdateRequest request = new PostUpdateRequest();

        User author = new User();
        author.setUsername(authorUsername);

        Post post = new Post();
        post.setAuthor(author);

        // findById가 호출 되면 위에서 만든 post 반환
        given(postRepository.findById(postId)).willReturn(Optional.of(post));

        assertThrows(BusinessException.class, () -> {
            postService.updatePost(postId, request, otherUsername);
        });
    }

    @Test
    @DisplayName("새로운 게시글을 작성할 수 있다")
    void createPost_success() {
        String username = "testuser";
        PostCreateRequest request = new PostCreateRequest();
        request.setTitle("새 제목");
        request.setContent("새 내용");

        User author = new User();
        author.setUsername(username);


        // findByUsername 시 author 반환
        given(userRepository.findByUsername(username)).willReturn(Optional.of(author));

        // save 호출 시 post 반환
        given(postRepository.save(any(Post.class))).willAnswer(invocation -> {
            return invocation.getArgument(0);
        });

        // when
        PostResponse response = postService.createPost(request, username);

        // then
        assertThat(response.getTitle()).isEqualTo("새 제목");

        // save 호출 확인
        verify(postRepository).save(any(Post.class));
    }

    @Test
    @DisplayName("본인의 게시글은 삭제할 수 있다.")
    void deletePost_success() {
        // given 준비
        Long  postId = 1L;
        String username = "testuser";

        User author = new User();
        author.setUsername(username);

        Post post = new Post();
        post.setId(postId);
        post.setAuthor(author);

        // id찾을 시 post 반환
        given(postRepository.findById(postId)).willReturn(Optional.of(post));

        // when 실행
        postService.deletePost(postId, username);

        // then 검증
        verify(postRepository).delete(post);
    }

    @Test
    @DisplayName("다른사람이 게시글을 삭제하려하면 businessException 발행")
    void deletePost_fail_notAuther() {
        // given 준비
        Long  postId = 1L;
        String authorUsername = "authorUsername";
        String otherUsername = "otherUsername";

        User author = new User();
        author.setUsername(authorUsername);

        Post post = new Post();
        post.setId(postId);
        post.setAuthor(author);

        // when 실행
        given(postRepository.findById(postId)).willReturn(Optional.of(post));

        // then 검증 otherUsername 이 삭제 실행
        assertThrows(BusinessException.class, () -> {postService.deletePost(postId, otherUsername);});
    }

    @Test
    @DisplayName("검색 조건에 맞는 게시글 목록을 페이징하여 조회할 수 있다")
    void getPosts_success() {
        // given 게시글 생성
        Long postId = 1L;
        String username = "testuser";

        PostSearchCondition condition = new PostSearchCondition();
        condition.setTitle("검색어");

        Pageable pageable = PageRequest.of(0, 10);

        Post post = new Post();
        post.setId(postId);
        post.setTitle("검색어 포함 제목");

        User author = new User();
        author.setUsername(username);

        post.setAuthor(author);

        // PageImpl
        List<Post> posts = List.of(post);
        Page<Post> page = new PageImpl<>(posts, pageable, posts.size());

        given(postRepository.search(condition, pageable)).willReturn(page);

        // when 검색 조건으로 페이징 조회
        Page<PostResponse> result = postService.getPosts(condition, pageable);
        
        // then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("검색어 포함 제목");

        verify(postRepository).search(condition, pageable);
    }

}
