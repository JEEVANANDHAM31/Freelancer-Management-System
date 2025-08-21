package com.examly.springapp.controller;

import com.examly.springapp.model.Contract;
import com.examly.springapp.model.Milestone;
import com.examly.springapp.service.ContractService;
import com.examly.springapp.service.MilestoneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "http://localhost:3000")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @Autowired
    private MilestoneService milestoneService;

    @PostMapping
    public ResponseEntity<?> createContract(@Valid @RequestBody Contract contract) {
        try {
            Contract saved = contractService.createContract(contract);
            return ResponseEntity.status(201).body(saved);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            if (e.getMessage().contains("not found")) {
                error.put("message", e.getMessage());
                return ResponseEntity.status(404).body(error);
            } else if (e.getMessage().contains("already exists")) {
                error.put("message", e.getMessage());
                return ResponseEntity.status(409).body(error);
            } else {
                error.put("message", e.getMessage());
                return ResponseEntity.badRequest().body(error);
            }
        }
    }

    @GetMapping
    public ResponseEntity<List<Contract>> getAllContracts() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContractById(@PathVariable Long id) {
        Contract contract = contractService.getContractById(id);
        if (contract != null) {
            return ResponseEntity.ok(contract);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Contract not found with ID: " + id);
            return ResponseEntity.status(404).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContract(@PathVariable Long id, @Valid @RequestBody Contract updatedContract) {
        Contract updated = contractService.updateContract(id, updatedContract);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Contract not found with ID: " + id);
            return ResponseEntity.status(404).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        boolean deleted = contractService.deleteContract(id);
        if (deleted) {
            Map<String, String> success = new HashMap<>();
            success.put("message", "Contract deleted successfully");
            return ResponseEntity.ok(success);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Contract not found with ID: " + id);
            return ResponseEntity.status(404).body(error);
        }
    }
}