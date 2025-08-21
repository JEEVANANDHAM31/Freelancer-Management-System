package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;

@Entity
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Project ID is required")
    @Column(name = "project_id")
    private Long projectId;

    @NotNull(message = "Freelancer ID is required")
    @Column(name = "freelancer_id")
    private Long freelancerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @NotNull(message = "Proposal ID is required")
    private Long proposalId;
    
    @NotNull(message = "Start date is required")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Pattern(regexp = "^(Milestone|Fixed|Hourly)$", message = "Payment terms must be Milestone, Fixed, or Hourly")
    private String paymentTerms;

    private Double paymentAmount;

    public enum Status {
        ACTIVE, COMPLETED, CANCELED
    }

    public Contract() {}

    public Contract(Long projectId, Long freelancerId) {
        this.projectId = projectId;
        this.freelancerId = freelancerId;
    }

    public Contract(Long proposalId, Date startDate, Date endDate, String paymentTerms, Double paymentAmount) {
        this.proposalId = proposalId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.paymentTerms = paymentTerms;
        this.paymentAmount = paymentAmount;
    }

 
    public Long getId() { return id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getFreelancerId() { return freelancerId; }
    public void setFreelancerId(Long freelancerId) { this.freelancerId = freelancerId; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    // Legacy methods for backward compatibility
    public Long getProposalId() { return proposalId; }
    public void setProposalId(Long proposalId) { this.proposalId = proposalId; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public String getPaymentTerms() { return paymentTerms; }
    public void setPaymentTerms(String paymentTerms) { this.paymentTerms = paymentTerms; }

    public Double getPaymentAmount() { return paymentAmount; }
    public void setPaymentAmount(Double paymentAmount) { this.paymentAmount = paymentAmount; }
}
