package com.examly.springapp.controller;

import com.examly.springapp.service.ProjectService;
import com.examly.springapp.service.ProposalService;
import com.examly.springapp.service.ContractService;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProposalService proposalService;

    @Autowired
    private ContractService contractService;

    @Autowired
    private UserService userService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long totalProjects = projectService.getAllProjects().size();
        long totalProposals = proposalService.getAllProposals().size();
        long totalContracts = contractService.getAllContracts().size();
        long totalUsers = userService.getAllUsers().size();

        Map<String, Long> response = new HashMap<>();
        response.put("totalProjects", totalProjects);
        response.put("totalProposals", totalProposals);
        response.put("totalContracts", totalContracts);
        response.put("totalUsers", totalUsers);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports/projects")
    public ResponseEntity<?> getProjectsReport() {
        Map<String, Object> response = new HashMap<>();
        response.put("projects", projectService.getAllProjects());
        response.put("totalCount", projectService.getAllProjects().size());
        return ResponseEntity.ok(response);
    }
}