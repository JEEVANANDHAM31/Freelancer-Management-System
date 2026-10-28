package com.examly.springapp.controller;

import com.examly.springapp.model.Message;
import com.examly.springapp.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        try {
            if (message.getProposalId() == null || message.getSenderId() == null
                    || message.getReceiverId() == null
                    || message.getContent() == null || message.getContent().isBlank()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "proposalId, senderId, receiverId, and content are required");
                return ResponseEntity.badRequest().body(error);
            }
            Message saved = messageService.sendMessage(message);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/proposal/{proposalId}")
    public ResponseEntity<List<Message>> getMessagesByProposal(@PathVariable Long proposalId) {
        return ResponseEntity.ok(messageService.getMessagesByProposalId(proposalId));
    }
}
