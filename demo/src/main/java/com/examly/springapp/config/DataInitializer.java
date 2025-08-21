package com.examly.springapp.config;

import com.examly.springapp.model.Proposal;
import com.examly.springapp.model.Project;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ProposalRepository;
import com.examly.springapp.repository.ProjectRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Configuration
public class DataInitializer {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            ProposalRepository proposalRepository) {
        
        return args -> {
            // Create system user for default proposals
            User systemUser = null;
            if (userRepository.count() == 0) {
                systemUser = new User();
                systemUser.setName("System");
                systemUser.setEmail("system@platform.com");
                systemUser.setPassword(passwordEncoder.encode("system123"));
                systemUser.setRole(User.Role.ADMIN);
                systemUser = userRepository.save(systemUser);

                User client = new User();
                client.setName("client1");
                client.setEmail("client1@example.com");
                client.setPassword(passwordEncoder.encode("password123"));
                client.setRole(User.Role.CLIENT);
                client = userRepository.save(client);

                User freelancer1 = new User();
                freelancer1.setName("freelancer1");
                freelancer1.setEmail("freelancer1@example.com");
                freelancer1.setPassword(passwordEncoder.encode("password123"));
                freelancer1.setRole(User.Role.FREELANCER);
                freelancer1 = userRepository.save(freelancer1);

                User freelancer2 = new User();
                freelancer2.setName("freelancer2");
                freelancer2.setEmail("freelancer2@example.com");
                freelancer2.setPassword(passwordEncoder.encode("password123"));
                freelancer2.setRole(User.Role.FREELANCER);
                freelancer2 = userRepository.save(freelancer2);

                // Create sample projects
                Project project1 = new Project();
                project1.setTitle("E-commerce Website Development");
                project1.setDescription("Need a full-stack e-commerce website with payment integration, user authentication, and admin dashboard.");
                project1.setBudget(7500.0);
                project1.setMinBudget(5000.0);
                project1.setMaxBudget(10000.0);
                project1.setDeadline(new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000));
                project1.setSkills(Arrays.asList("React", "Spring Boot", "MySQL", "Stripe API"));
                project1.setClientId(client.getId());
                project1 = projectRepository.save(project1);

                Project project2 = new Project();
                project2.setTitle("Mobile App UI Design");
                project2.setDescription("Looking for a talented UI/UX designer to create a modern mobile app interface for a fitness tracking application.");
                project2.setBudget(2250.0);
                project2.setMinBudget(2000.0);
                project2.setMaxBudget(2500.0);
                project2.setDeadline(new Date(System.currentTimeMillis() + 14L * 24 * 60 * 60 * 1000));
                project2.setSkills(Arrays.asList("Figma", "Adobe XD", "UI/UX Design", "Mobile Design"));
                project2.setClientId(client.getId());
                project2 = projectRepository.save(project2);

                // Create sample proposals
                Proposal proposal1 = new Proposal();
                proposal1.setProjectId(project1.getId());
                proposal1.setFreelancerId(freelancer1.getId());
                proposal1.setProposalText("I have 5+ years of experience in e-commerce development. I can build a scalable solution using React and Spring Boot with integrated payment systems. I'll include responsive design, admin dashboard, and comprehensive testing.");
                proposal1.setBidAmount(7500.0);
                proposal1.setEstimatedDays(25);
                proposalRepository.save(proposal1);

                Proposal proposal2 = new Proposal();
                proposal2.setProjectId(project1.getId());
                proposal2.setFreelancerId(freelancer2.getId());
                proposal2.setProposalText("As a certified full-stack developer, I specialize in e-commerce solutions. I'll deliver a secure, scalable platform with modern UI, payment integration, and mobile responsiveness. Includes 3 months of support.");
                proposal2.setBidAmount(6800.0);
                proposal2.setEstimatedDays(28);
                proposalRepository.save(proposal2);

                Proposal proposal3 = new Proposal();
                proposal3.setProjectId(project2.getId());
                proposal3.setFreelancerId(freelancer1.getId());
                proposal3.setProposalText("I'm a UI/UX designer with expertise in fitness apps. I'll create a modern, intuitive interface with user journey mapping, wireframes, and high-fidelity prototypes. Includes 2 rounds of revisions.");
                proposal3.setBidAmount(2200.0);
                proposal3.setEstimatedDays(10);
                proposalRepository.save(proposal3);

                // Add default proposals for all projects
                addDefaultProposalsForAllProjects(projectRepository, proposalRepository, systemUser);
            } else {
                
                systemUser = userRepository.findAll().stream()
                    .filter(u -> "system@platform.com".equals(u.getEmail()))
                    .findFirst()
                    .orElseGet(() -> {
                        User newSystemUser = new User();
                        newSystemUser.setName("System");
                        newSystemUser.setEmail("system@platform.com");
                        newSystemUser.setPassword(passwordEncoder.encode("system123"));
                        newSystemUser.setRole(User.Role.ADMIN);
                        return userRepository.save(newSystemUser);
                    });
                
                
                addDefaultProposalsForAllProjects(projectRepository, proposalRepository, systemUser);
            }
        };
    }

    private void addDefaultProposalsForAllProjects(ProjectRepository projectRepository, 
                                                  ProposalRepository proposalRepository, 
                                                  User systemUser) {
        List<Project> allProjects = projectRepository.findAll();
        
        for (Project project : allProjects) {
            // Check if project has any proposals
            boolean hasProposals = proposalRepository.findAll().stream()
                .anyMatch(p -> p.getProjectId().equals(project.getId()));
                
            if (!hasProposals) {
                // Create default proposal
                Proposal defaultProposal = new Proposal();
                defaultProposal.setProjectId(project.getId());
                defaultProposal.setFreelancerId(systemUser.getId());
                defaultProposal.setProposalText("This is a default placeholder proposal to demonstrate the platform. Submit your own proposal to replace this placeholder and start bidding on this project!");
                defaultProposal.setBidAmount(project.getBudget() * 0.8); // 80% of budget
                defaultProposal.setEstimatedDays(30);
                proposalRepository.save(defaultProposal);
            }
        }
    }
}
