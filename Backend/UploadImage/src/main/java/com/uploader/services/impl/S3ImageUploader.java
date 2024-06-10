package com.uploader.services.impl;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.uploader.exceptions.ImageUploadException;
import com.uploader.services.ImageUploader;
import jdk.jshell.spi.SPIResolutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class S3ImageUploader implements ImageUploader {

    @Autowired
    private AmazonS3 client;

    @Value("${app.s3.bucket}")
    private String bucketName;

    @Override
    public String uploadImage(MultipartFile image) {

        if (image == null) {
            throw new ImageUploadException("image is null");
        }

        String actualFileName = image.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + actualFileName.substring(actualFileName.lastIndexOf("."));

        ObjectMetadata metadata = new ObjectMetadata();

        metadata.setContentLength(image.getSize());

        try {
            PutObjectResult putObjectResult = client.putObject(new PutObjectRequest(bucketName, fileName, image.getInputStream(), metadata));
            return this.preSignedUrl(fileName);
        } catch (IOException ioe) {
            throw new ImageUploadException("error in uploading image: " + ioe.getMessage());
        }
    }

    @Override
    public List<String> allFiles() {

        ListObjectsV2Request listObjectRequest = new ListObjectsV2Request().withBucketName(bucketName);

        ListObjectsV2Result listObjectV2Result = client.listObjectsV2(listObjectRequest);
        List<S3ObjectSummary> objectSummaries = listObjectV2Result.getObjectSummaries();

        //list of presigned urls, key refers to the filename of the image
        List<String> listFileUrls = objectSummaries.stream().map(item -> this.preSignedUrl(item.getKey()))
                .collect(Collectors.toList());

        return listFileUrls;
    }

    @Override
    public String preSignedUrl(String fileName) {

        Date expirationDate = new Date();

        long time = expirationDate.getTime();
        int hour = 2;
        time = time + hour * 60 * 60 * 1000;

        expirationDate.setTime(time);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, fileName, HttpMethod.GET)
                        .withExpiration(expirationDate);
        URL url = client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    @Override
    public String getImageUrlByName(String fileName) {
        S3Object s3Object = client.getObject(bucketName, fileName);
        String key = s3Object.getKey();
        String url = this.preSignedUrl(key);
        return url;
    }
}
