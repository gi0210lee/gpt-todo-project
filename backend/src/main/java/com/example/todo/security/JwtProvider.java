package com.example.todo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    private final String SECRET_KEY = "my-secret-key-my-secret-key-my-secret-key\"";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    private final long ACCESS_TOKEN_EXPIRE = 1000 * 60 * 30; // 30분

    private final long REFRESH_TOKEN_EXPIRE = 1000 * 60 * 60 * 24 * 1; // 1일


    public String createAccessToken(String username) {
        Date now = new Date();
        Date expiry =  new Date(now.getTime() + ACCESS_TOKEN_EXPIRE);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(String username) {
        Date now = new Date();
        Date expiry =  new Date(now.getTime() + REFRESH_TOKEN_EXPIRE);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims parseClaims (String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token is expired");
        } catch (JwtException e) {
            System.out.println("Token is invalid");
        }

        return false;
    }
}
