package com.uploader.controllers;

import com.uploader.services.ImageUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/s3")
@CrossOrigin(origins = "http://localhost:5173")
public class S3Controller {

    @Autowired
    private ImageUploader imageUploader;


    public S3Controller(ImageUploader imageUploader) {
        this.imageUploader = imageUploader;
    }


    @GetMapping
    public List<String> getAllFiles(){
        return imageUploader.allFiles();
    }

    @GetMapping("/{fileName}")
    public String getFileByFileName(@PathVariable String fileName){
        return imageUploader.getImageUrlByName(fileName);
    }

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam MultipartFile file) throws IOException {
        return ResponseEntity.ok(imageUploader.uploadImage(file));
    }
}
