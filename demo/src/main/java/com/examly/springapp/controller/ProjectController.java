package com.examly.springapp.controller;

import com.examly.springapp.model.Project;
import com.examly.springapp.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody Project project) {
        Project saved = projectService.createProject(project);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Project>> getMyProjects(@RequestParam Long clientId) {
        return ResponseEntity.ok(projectService.getProjectsByClientId(clientId));
    }

    @GetMapping("/{id}/proposals")
    public ResponseEntity<?> getProjectProposals(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectProposals(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Project not found with ID: " + id);
                    return ResponseEntity.status(404).body(error);
                });
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @Valid @RequestBody Project updatedProject) {
        Optional<Project> updated = projectService.updateProject(id, updatedProject);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Project not found with ID: " + id);
            return ResponseEntity.status(404).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        boolean deleted = projectService.deleteProject(id);
        if (deleted) {
            Map<String, String> success = new HashMap<>();
            success.put("message", "Project deleted successfully");
            return ResponseEntity.ok(success);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Project not found with ID: " + id);
            return ResponseEntity.status(404).body(error);
        }
    }


}
