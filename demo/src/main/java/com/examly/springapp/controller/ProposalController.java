package com.examly.springapp.controller;

import com.examly.springapp.model.Proposal;
import com.examly.springapp.service.ProposalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/proposals")
@CrossOrigin(origins = "http://localhost:3000")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @PostMapping
    public ResponseEntity<?> createProposal(@Valid @RequestBody Proposal proposal) {
        try {
            Proposal saved = proposalService.createProposal(proposal);
            return ResponseEntity.status(201).body(saved);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            if (e.getMessage().contains("not found")) {
                error.put("message", e.getMessage());
                return ResponseEntity.status(404).body(error);
            } else if (e.getMessage().contains("already submitted")) {
                error.put("message", e.getMessage());
                return ResponseEntity.status(409).body(error);
            } else {
                error.put("message", e.getMessage());
                return ResponseEntity.badRequest().body(error);
            }
        }
    }

    @PostMapping("/projects/{projectId}")
    public ResponseEntity<?> createProposalForProject(
            @PathVariable Long projectId,
            @Valid @RequestBody Proposal proposal) {
        proposal.setProjectId(projectId);
        return createProposal(proposal);
    }

    @GetMapping
    public ResponseEntity<List<Proposal>> getAllProposals() {
        return ResponseEntity.ok(proposalService.getAllProposals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProposalById(@PathVariable Long id) {
        return proposalService.getProposalById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Proposal not found with ID: " + id);
                    return ResponseEntity.status(404).body(error);
                });
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProposal(@PathVariable Long id, @Valid @RequestBody Proposal updatedProposal) {
        Optional<Proposal> updated = proposalService.updateProposal(id, updatedProposal);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Proposal not found with ID: " + id);
            return ResponseEntity.status(404).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProposal(@PathVariable Long id) {
        boolean deleted = proposalService.deleteProposal(id);
        if (deleted) {
            Map<String, String> success = new HashMap<>();
            success.put("message", "Proposal deleted successfully");
            return ResponseEntity.ok(success);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Proposal not found with ID: " + id);
            return ResponseEntity.status(404).body(error);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Proposal>> getMyProposals(@RequestParam Long freelancerId) {
        return ResponseEntity.ok(proposalService.getProposalsByFreelancerId(freelancerId));
    }
}