import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Chat.css';

const Chat = ({ proposalId, currentUser, otherUserId, otherUserName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [fetching, setFetching] = useState(true);
    const bottomRef = useRef(null);
    const pollRef = useRef(null);
    const inputRef = useRef(null);

    /* ── Fetch all messages for this proposal ── */
    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/messages/proposal/${proposalId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch {
            // silent on poll failures
        } finally {
            setFetching(false);
        }
    }, [proposalId]);

    useEffect(() => {
        fetchMessages();
        pollRef.current = setInterval(fetchMessages, 4000);
        return () => clearInterval(pollRef.current);
    }, [fetchMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /* ── Send ── */
    const handleSend = async (e) => {
        e.preventDefault();
        const text = newMessage.trim();
        if (!text) return;
        setSending(true);
        setError('');
        try {
            const payload = {
                proposalId,
                senderId: currentUser.id,
                receiverId: otherUserId,
                content: text,
                senderName: currentUser.name || currentUser.email || `User #${currentUser.id}`,
                senderRole: currentUser.role,
            };
            const res = await fetch('http://localhost:8080/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to send message');
            }
            const saved = await res.json();
            setMessages(prev => [...prev, saved]);
            setNewMessage('');
            inputRef.current?.focus();
        } catch (err) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    /* ── Helpers ── */
    const fmtTime = (sentAt) => {
        if (!sentAt) return '';
        const d = new Date(sentAt);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const fmtDate = (sentAt) => {
        if (!sentAt) return '';
        const d = new Date(sentAt);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) return 'Today';
        const isYesterday = d.toDateString() === new Date(now - 86400000).toDateString();
        if (isYesterday) return 'Yesterday';
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    /* Group messages by date for dividers */
    const groupedMessages = messages.reduce((groups, msg) => {
        const dateKey = fmtDate(msg.sentAt);
        if (!groups.length || groups[groups.length - 1].date !== dateKey) {
            groups.push({ date: dateKey, messages: [msg] });
        } else {
            groups[groups.length - 1].messages.push(msg);
        }
        return groups;
    }, []);

    return (
        <div className="chat-wrap">
            {/* Header */}
            <div className="chat-hdr">
                <div className="chat-hdr-avatar">
                    {(otherUserName || 'U')[0].toUpperCase()}
                </div>
                <div className="chat-hdr-info">
                    <span className="chat-hdr-name">{otherUserName || `User #${otherUserId}`}</span>
                    <span className="chat-hdr-status">
                        <span className="chat-online-dot" /> Active
                    </span>
                </div>
                <span className="chat-hdr-badge">Collaboration Chat</span>
            </div>

            {/* Messages */}
            <div className="chat-body">
                {fetching ? (
                    <div className="chat-spinner-wrap">
                        <div className="chat-spinner" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">💬</div>
                        <p>Start your collaboration!</p>
                        <span>Messages are visible to both parties.</span>
                    </div>
                ) : (
                    groupedMessages.map((group, gi) => (
                        <div key={gi}>
                            <div className="chat-date-divider">
                                <span>{group.date}</span>
                            </div>
                            {group.messages.map(msg => {
                                const isMe = String(msg.senderId) === String(currentUser.id);
                                const name = isMe ? 'You' : (msg.senderName || otherUserName || `User #${msg.senderId}`);
                                return (
                                    <div key={msg.id} className={`chat-msg-row ${isMe ? 'chat-row-me' : 'chat-row-other'}`}>
                                        {!isMe && (
                                            <div className="chat-avatar chat-avatar-other">
                                                {name[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-other'}`}>
                                            <span className="chat-sender">{name}</span>
                                            <p className="chat-text">{msg.content}</p>
                                            <span className="chat-time">{fmtTime(msg.sentAt)}</span>
                                        </div>
                                        {isMe && (
                                            <div className="chat-avatar chat-avatar-me">
                                                {(currentUser.name || 'Y')[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Error */}
            {error && <div className="chat-err">{error}</div>}

            {/* Input */}
            <form className="chat-footer" onSubmit={handleSend}>
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    placeholder="Type a message… (Enter to send)"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                    maxLength={1000}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="chat-send"
                    disabled={sending || !newMessage.trim()}
                    title="Send message"
                >
                    {sending ? <span className="chat-send-spin" /> : '➤'}
                </button>
            </form>
        </div>
    );
};

export default Chat;
