package com.examly.springapp.service;

import com.examly.springapp.model.Project;
import com.examly.springapp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProposalService proposalService;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByClientId(Long clientId) {
        return projectRepository.findByClientId(clientId);
    }

    @Transactional
    public Optional<Project> updateProject(Long id, Project updatedProject) {
        return projectRepository.findById(id).map(existingProject -> {
            // Update scalar fields
            existingProject.setTitle(updatedProject.getTitle());
            existingProject.setDescription(updatedProject.getDescription());
            existingProject.setBudget(updatedProject.getBudget());
            existingProject.setDeadline(updatedProject.getDeadline());
            existingProject.setClientId(updatedProject.getClientId());

            
            existingProject.getSkills().clear(); 
            existingProject.getSkills().addAll(updatedProject.getSkills()); // Add new ones

            return projectRepository.save(existingProject);
        });
    }

    public boolean deleteProject(Long id) {
        return projectRepository.findById(id).map(project -> {
            projectRepository.delete(project);
            return true;
        }).orElse(false);
    }

    public List<com.examly.springapp.model.Proposal> getProjectProposals(Long projectId) {
        return proposalService.getProposalsByProjectId(projectId);
    }
}
