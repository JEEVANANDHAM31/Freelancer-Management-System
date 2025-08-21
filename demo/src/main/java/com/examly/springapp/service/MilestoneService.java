package com.examly.springapp.service;

import com.examly.springapp.model.Milestone;
import com.examly.springapp.repository.MilestoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MilestoneService {

    @Autowired
    private MilestoneRepository milestoneRepository;

    public Milestone createMilestone(Milestone milestone) {
        return milestoneRepository.save(milestone);
    }

    public List<Milestone> getMilestonesByContractId(Long contractId) {
        return milestoneRepository.findByContractId(contractId);
    }

    public Optional<Milestone> getMilestoneById(Long id) {
        return milestoneRepository.findById(id);
    }

    public Optional<Milestone> updateMilestone(Long id, Milestone updatedMilestone) {
        return milestoneRepository.findById(id).map(existing -> {
            existing.setDescription(updatedMilestone.getDescription());
            existing.setStatus(updatedMilestone.getStatus());
            return milestoneRepository.save(existing);
        });
    }

    public boolean deleteMilestone(Long id) {
        return milestoneRepository.findById(id).map(milestone -> {
            milestoneRepository.delete(milestone);
            return true;
        }).orElse(false);
    }
}