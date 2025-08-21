package com.examly.springapp.service;

import com.examly.springapp.model.File;
import com.examly.springapp.model.Project;
import com.examly.springapp.repository.FileRepository;
import com.examly.springapp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    private final Path root = Paths.get(System.getProperty("user.home"), "uploads");

    public void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public File createFile(File file) {
        return fileRepository.save(file);
    }

    public List<File> getFilesByProjectId(Long projectId) {
        return fileRepository.findByProjectId(projectId);
    }

    public Optional<File> getFileById(Long id) {
        return fileRepository.findById(id);
    }

    public boolean deleteFile(Long id) {
        return fileRepository.findById(id).map(file -> {
            fileRepository.delete(file);
            return true;
        }).orElse(false);
    }

    public File saveFile(Long projectId, MultipartFile multipartFile) throws IOException {
        String originalFileName = multipartFile.getOriginalFilename();
        String fileName = originalFileName;
        Path filePath = this.root.resolve(fileName);
        int count = 1;
        while(Files.exists(filePath)) {
            fileName = originalFileName.substring(0, originalFileName.lastIndexOf("."))
                    + "_" + count++ + originalFileName.substring(originalFileName.lastIndexOf("."));
            filePath = this.root.resolve(fileName);
        }

        Files.copy(multipartFile.getInputStream(), filePath);

        File newFile = new File();
        newFile.setFileName(fileName);
        newFile.setFileUrl(this.root.resolve(fileName).toString());
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        newFile.setProject(project);
        return fileRepository.save(newFile);
    }
}
