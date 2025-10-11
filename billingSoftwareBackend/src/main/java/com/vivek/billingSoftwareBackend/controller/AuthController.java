package com.vivek.billingSoftwareBackend.controller;

import com.vivek.billingSoftwareBackend.io.AuthRequest;
import com.vivek.billingSoftwareBackend.io.AuthResponse;
import com.vivek.billingSoftwareBackend.service.UserService;
import com.vivek.billingSoftwareBackend.service.impl.AppUserDetailsService;
import com.vivek.billingSoftwareBackend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.hibernate.cache.internal.DisabledCaching;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;


@RestController
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) throws Exception {
//        System.out.println("yaha aa gaye hai");
        authenticate(request.getEmail(), request.getPassword());
        System.out.println("yaha aa gaye hai");
        final UserDetails userDetails = appUserDetailsService.loadUserByUsername(request.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
//        System.out.println("yaha aa gaye hai");
        String role = userService.getUserRole(request.getEmail());
        return new AuthResponse(request.getEmail(), jwtToken, role);
    }

    private void authenticate(String email, String password) throws Exception{
        System.out.println("yaha aa gaye authenticate me");
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            System.out.println("yaha aa gaye try block me");
        }catch (DisabledException e ) {
            throw new Exception("User disabled");
        }catch (BadCredentialsException e) {
            System.out.println("yaha aa gaye try bad me");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email or password is incorrect");
        }
    }

    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String, String> request){
        return passwordEncoder.encode(request.get("password"));
    }
}
