package com.vivek.billingSoftwareBackend.config;

import com.vivek.billingSoftwareBackend.filters.JwtRequestFilter;
import com.vivek.billingSoftwareBackend.service.impl.AppUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService appUserDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Spring Security will auto-discover the corsConfigurationSource() bean below
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Allow all OPTIONS preflight requests — must be first
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // NOTE: These paths are relative to the servlet context path.
                // Since application.properties sets server.servlet.context-path=/api/v1.0,
                // Spring Security evaluates paths AFTER stripping that prefix.
                // So "/login" here matches the full URL "/api/v1.0/login" — no change needed.
                .requestMatchers("/login", "/encode").permitAll()
                // Authenticated user endpoints (USER or ADMIN)
                .requestMatchers(
                    "/categories", "/categories/**",
                    "/items", "/items/**",
                    "/orders", "/orders/**",
                    "/payments", "/payments/**",
                    "/dashboard", "/dashboard/**",
                    "/barcodes", "/barcodes/**"
                ).hasAnyRole("USER", "ADMIN")
                // Admin-only endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Spring Security's http.cors(Customizer.withDefaults()) automatically picks up
     * a bean named "corsConfigurationSource". Do NOT also register a CorsFilter bean —
     * doing so causes a double-filter conflict that results in 403 on all requests
     * including public endpoints like /login and /encode.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
            "https://retailbusinessmanagement.netlify.app",
            "http://localhost:5173"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(appUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }
}