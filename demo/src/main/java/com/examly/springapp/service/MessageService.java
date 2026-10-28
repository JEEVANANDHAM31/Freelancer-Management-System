package com.examly.springapp.service;

import com.examly.springapp.model.Message;
import com.examly.springapp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByProposalId(Long proposalId) {
        return messageRepository.findByProposalIdOrderBySentAtAsc(proposalId);
    }
}
