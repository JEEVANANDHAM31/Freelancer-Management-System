package com.examly.springapp.repository;

import com.examly.springapp.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    List<Proposal> findByFreelancerId(Long freelancerId);
    List<Proposal> findByProjectId(Long projectId);
}
