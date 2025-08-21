package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "proposals")
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "project_id")
    private Long projectId;

    @NotNull
    @Column(name = "freelancer_id")
    private Long freelancerId;

    @NotNull
    @Min(1)
    @Column(name = "bid_amount", precision = 10) // REMOVED scale = 2
    private Double bidAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, ACCEPTED, REJECTED
    }

    @NotBlank
    @Size(min = 20)
    private String proposalText;

    @Min(1)
    private int estimatedDays;

    // Constructors
    public Proposal() {}

    public Proposal(Long projectId, Long freelancerId, Double bidAmount, String proposalText, int estimatedDays) {
        this.projectId = projectId;
        this.freelancerId = freelancerId;
        this.bidAmount = bidAmount;
        this.proposalText = proposalText;
        this.estimatedDays = estimatedDays;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getFreelancerId() {
        return freelancerId;
    }

    public void setFreelancerId(Long freelancerId) {
        this.freelancerId = freelancerId;
    }

    public Double getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(Double bidAmount) {
        this.bidAmount = bidAmount;
    }

    public String getProposalText() {
        return proposalText;
    }

    public void setProposalText(String proposalText) {
        this.proposalText = proposalText;
    }

    public int getEstimatedDays() {
        return estimatedDays;
    }

    public void setEstimatedDays(int estimatedDays) {
        this.estimatedDays = estimatedDays;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}