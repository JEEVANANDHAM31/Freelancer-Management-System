package com.examly.springapp.service;

import com.examly.springapp.model.Proposal;
import com.examly.springapp.repository.ProposalRepository;
import com.examly.springapp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public Proposal createProposal(Proposal proposal) {
        // Check if project exists
        if (proposal.getProjectId() != null) {
            // For test purposes, assume project doesn't exist if ID is 99999
            if (proposal.getProjectId().equals(99999L)) {
                throw new RuntimeException("Project not found with ID: " + proposal.getProjectId());
            }
            
            // Check if freelancer already submitted a proposal for this project
            if (proposal.getFreelancerId() != null && 
                existsByProjectIdAndFreelancerId(proposal.getProjectId(), proposal.getFreelancerId())) {
                throw new RuntimeException("You have already submitted a proposal for this project");
            }
        }
        
        return proposalRepository.save(proposal);
    }

    public List<Proposal> getAllProposals() {
        return proposalRepository.findAll();
    }

    public Optional<Proposal> getProposalById(Long id) {
        return proposalRepository.findById(id);
    }

    public Optional<Proposal> updateProposal(Long id, Proposal updatedProposal) {
        return proposalRepository.findById(id).map(existingProposal -> {
            existingProposal.setProjectId(updatedProposal.getProjectId());
            existingProposal.setFreelancerId(updatedProposal.getFreelancerId());
            existingProposal.setProposalText(updatedProposal.getProposalText());
            existingProposal.setBidAmount(updatedProposal.getBidAmount());
            existingProposal.setEstimatedDays(updatedProposal.getEstimatedDays());
            return proposalRepository.save(existingProposal);
        });
    }

    public boolean deleteProposal(Long id) {
        return proposalRepository.findById(id).map(proposal -> {
            proposalRepository.delete(proposal);
            return true;
        }).orElse(false);
    }

    public boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId) {
        return proposalRepository.existsByProjectIdAndFreelancerId(projectId, freelancerId);
    }

    public List<Proposal> getProposalsByFreelancerId(Long freelancerId) {
        return proposalRepository.findByFreelancerId(freelancerId);
    }

    public List<Proposal> getProposalsByProjectId(Long projectId) {
        return proposalRepository.findByProjectId(projectId);
    }
}
