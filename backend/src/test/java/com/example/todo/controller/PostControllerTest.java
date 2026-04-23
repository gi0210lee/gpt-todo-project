package com.example.todo.controller;

import com.example.todo.dto.post.PostResponse;
import com.example.todo.dto.post.PostUpdateRequest;
import com.example.todo.entity.User;
import com.example.todo.repository.PostRepository;
import com.example.todo.service.PostService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MediaType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PostService postService;

    @Test
    @WithMockUser
    @DisplayName("게시글 상세 조회 API(Get /api/posts/{id})")
    void getPost_success() throws Exception {

        // 가짜 데이터
        Long postId = 1L;
        PostResponse response = new PostResponse();
        response.setId(postId);
        response.setTitle("테스트 제목");
        response.setContent("테스트 내용");
        response.setAuthorName("test1");

        // id 조회 시 가짜 응답 데이터 반환
        given(postService.getPost(postId)).willReturn(response);

        // when then
        mockMvc.perform(get("/api/posts/" + postId)) // get 요청
                .andExpect(status().isOk()) // 200인지 확인
                .andExpect(jsonPath("$.data.title").value("테스트 제목")) // JSON 응답 필드 값 검증
                .andExpect(jsonPath("$.data.authorName").value("test1"));
    }

    @Test
    @WithMockUser(username="testuser")
    @DisplayName("게시글 수정 API(PUT /api/posts/{id})")
    void updatePost_success() throws Exception {
        Long postId = 1L;
        PostUpdateRequest request = new PostUpdateRequest();
        request.setTitle("수정된 제목");
        request.setContent("수정된 내용");

        PostResponse response = new PostResponse();
        response.setId(postId);
        response.setTitle("수정된 제목");
        request.setContent("수정된 내용");

        given(postService.updatePost(any(Long.class), any(PostUpdateRequest.class), any(String.class))).willReturn(response);

        mockMvc.perform(put("/api/posts/" + postId)
                .contentType(String.valueOf(MediaType.APPLICATION_JSON))
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("수정된 제목"));

    }

}
