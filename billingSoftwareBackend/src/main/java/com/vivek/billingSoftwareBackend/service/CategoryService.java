package com.vivek.billingSoftwareBackend.service;

import com.vivek.billingSoftwareBackend.io.CategoryRequest;
import com.vivek.billingSoftwareBackend.io.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    
    CategoryResponse add(CategoryRequest request, MultipartFile file);

    List<CategoryResponse> read();

    void delete(String categoryId);
}
