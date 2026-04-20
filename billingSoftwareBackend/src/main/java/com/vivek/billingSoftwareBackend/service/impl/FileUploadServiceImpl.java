package com.vivek.billingSoftwareBackend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vivek.billingSoftwareBackend.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );
            // Cloudinary returns the secure HTTPS URL directly
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error occurred while uploading image to Cloudinary"
            );
        }
    }

    @Override
    public boolean deleteFile(String imgUrl) {
        try {
            // Extract public_id from the Cloudinary URL
            // URL format: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
            String publicId = extractPublicId(imgUrl);
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error occurred while deleting image from Cloudinary"
            );
        }
    }

    private String extractPublicId(String imgUrl) {
        // e.g. https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
        // public_id = "sample"
        String withoutQuery = imgUrl.split("\\?")[0];
        String[] parts = withoutQuery.split("/");
        String fileWithExt = parts[parts.length - 1];
        // Remove extension
        return fileWithExt.contains(".") ? fileWithExt.substring(0, fileWithExt.lastIndexOf('.')) : fileWithExt;
    }
}