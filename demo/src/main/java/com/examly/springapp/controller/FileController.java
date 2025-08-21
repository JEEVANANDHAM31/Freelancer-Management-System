package com.examly.springapp.controller;

import com.examly.springapp.model.File;
import com.examly.springapp.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/projects/{projectId}/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<File> uploadFile(@PathVariable Long projectId, @RequestParam("file") MultipartFile file) throws IOException {
        File savedFile = fileService.saveFile(projectId, file);
        return ResponseEntity.ok(savedFile);
    }
}
