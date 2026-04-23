package com.example.todo.service;

import com.example.todo.dto.auth.SignupRequest;
import com.example.todo.entity.RefreshToken;
import com.example.todo.entity.User;
import com.example.todo.dto.auth.LoginRequest;
import com.example.todo.dto.auth.TokenResponse;
import com.example.todo.repository.RefreshTokenRepository;
import com.example.todo.repository.UserRepository;
import com.example.todo.security.JwtProvider;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public void signup(SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

//        return jwtProvider.generateToken(username);
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found") );

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String accessToken = jwtProvider.createAccessToken(request.getUsername());
        String refreshToken = jwtProvider.createRefreshToken(request.getUsername());

        RefreshToken token = refreshTokenRepository.findByUser(user).orElseGet(RefreshToken::new);
        token.setUser(user);
        token.setToken(refreshToken);
        token.setExpiryDate(LocalDateTime.now().plusDays(7));

        refreshTokenRepository.save(token);


        return new TokenResponse(accessToken, refreshToken);
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken).orElseThrow(() -> new RuntimeException("Token not found"));

        if (storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new  RuntimeException("Token expired");
        }

        String username = storedToken.getUser().getUsername();

        String newAccessToken = jwtProvider.createAccessToken(username);
//        String newRefreshToken = jwtProvider.createRefreshToken(username);

        return new TokenResponse(newAccessToken, refreshToken);
    }

}
