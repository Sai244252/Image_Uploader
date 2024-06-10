package com.uploader.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageUploader {

    String uploadImage(MultipartFile image) throws IOException;

    List<String> allFiles();

    String preSignedUrl(String fileName);

    String getImageUrlByName(String fileName);
}
