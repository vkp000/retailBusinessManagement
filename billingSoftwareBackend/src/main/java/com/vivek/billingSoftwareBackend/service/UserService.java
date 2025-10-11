package com.vivek.billingSoftwareBackend.service;

import com.vivek.billingSoftwareBackend.io.UserRequest;
import com.vivek.billingSoftwareBackend.io.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    List<UserResponse> readUsers();

    void deleteUser(String id);
}
