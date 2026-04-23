package com.example.todo.controller;

import com.example.todo.dto.auth.SignupRequest;
import com.example.todo.dto.common.ApiResponse;
import com.example.todo.dto.auth.LoginRequest;
import com.example.todo.dto.auth.TokenResponse;
import com.example.todo.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ApiResponse<Void> signup(@RequestBody SignupRequest request) {
        authService.signup(request);
        return ApiResponse.success(null);
    }

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestBody String refreshToken) {
        TokenResponse response = authService.refresh(refreshToken);
        return ApiResponse.success(response);
    }


    @GetMapping("/me")
    public ApiResponse<Map<String, String>> getCurrentUser(@AuthenticationPrincipal String username) {
        Map<String, String> user = new HashMap<>();
        user.put("username", username);
        return ApiResponse.success(user);
    }

}
