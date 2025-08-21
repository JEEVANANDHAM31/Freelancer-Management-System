package com.examly.springapp.controller;

import com.examly.springapp.model.Milestone;
import com.examly.springapp.service.MilestoneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/contracts/{contractId}/milestones")
@CrossOrigin(origins = "http://localhost:3000")
public class MilestoneController {

    @Autowired
    private MilestoneService milestoneService;

    @PostMapping
    public ResponseEntity<?> createMilestone(@PathVariable Long contractId, @Valid @RequestBody Milestone milestone) {
        milestone.setContractId(contractId);
        Milestone saved = milestoneService.createMilestone(milestone);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Milestone>> getMilestonesByContract(@PathVariable Long contractId) {
        return ResponseEntity.ok(milestoneService.getMilestonesByContractId(contractId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMilestone(@PathVariable Long contractId, @PathVariable Long id, @Valid @RequestBody Milestone milestone) {
        return milestoneService.updateMilestone(id, milestone)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Milestone not found");
                    return ResponseEntity.status(404).body(error);
                });
    }
}