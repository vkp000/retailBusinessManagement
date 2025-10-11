package com.vivek.billingSoftwareBackend.util;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
// ❌ yeh hata do
// import javax.annotation.PostConstruct;

// ✅ yeh lagao
import jakarta.annotation.PostConstruct;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String SECRET_KEY;
    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        // String ko SecretKey mein convert karna (HS256 ke liye)
        this.secretKey = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    public String extractUsername(String jwt) {
        return extractClaim(jwt, Claims::getSubject);

    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey) // ✅ new API (0.12.6)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    public boolean validateToken(String jwt, UserDetails userDetails) {
        final String username = extractUsername(jwt);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String generateToken(UserDetails userDetails) {
        long expirationMillis = 1000 * 60 * 60 * 10; // 10 hours
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .subject(userDetails.getUsername())   // ✅ username as subject
                .issuedAt(now)                        // ✅ iat claim
                .expiration(expiryDate)               // ✅ exp claim
                .signWith(secretKey)                  // ✅ HS256 with secretKey
                .compact();
    }

}
