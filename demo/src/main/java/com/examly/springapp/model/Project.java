package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin(value = "10.0", message = "Budget must be at least 10")
    @Column(precision = 10) // REMOVED scale = 2
    private Double budget;

    @DecimalMin(value = "10.0", message = "Min budget must be at least 10")
    @Column(name = "min_budget", precision = 10) // REMOVED scale = 2
    private Double minBudget;

    @DecimalMin(value = "10.0", message = "Max budget must be at least 10")
    @Column(name = "max_budget", precision = 10) // REMOVED scale = 2
    private Double maxBudget;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be a future date")
    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date deadline;

    @ElementCollection
    @CollectionTable(name = "project_skills", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill")
    @Size(min = 1, message = "At least one skill is required")
    private List<String> skills = new ArrayList<>();

    public enum Status {
        OPEN, IN_PROGRESS, COMPLETED, CLOSED
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public Date getDeadline() { return deadline; }
    public void setDeadline(Date deadline) { this.deadline = deadline; }
    
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    
    public Double getMinBudget() { return minBudget != null ? minBudget : budget; }
    public void setMinBudget(Double minBudget) { 
        this.minBudget = minBudget;
        if (this.budget == null) this.budget = minBudget;
    }
    
    public Double getMaxBudget() { return maxBudget != null ? maxBudget : budget; }
    public void setMaxBudget(Double maxBudget) { 
        this.maxBudget = maxBudget;
        if (this.budget == null) this.budget = maxBudget;
    }
}