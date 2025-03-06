import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';

export default function HomePage() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Select a chat
    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    // Create a new chat
    const handleNewChat = () => {
        const newChat = {
            id: chats.length + 1,
            title: `New Chat ${chats.length + 1}`,
            date: new Date().toLocaleDateString(),
            messages: []
        };
        setChats([newChat, ...chats]);
        setSelectedChat(newChat);
    };

    // Fetch AI Response from Assistant API
    const fetchAIResponse = async (messages) => {
        try {
            setLoading(true);
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            const data = await response.json();
            setLoading(false);

            if (data.error) {
                console.error("AI Error:", data.error);
                return "Error: AI could not respond.";
            }

            return data.response || "No response from AI.";
        } catch (error) {
            setLoading(false);
            console.error("Error fetching response:", error);
            return "Error: Could not connect to AI.";
        }
    };

    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedChat) return;

        // Update user messages
        const updatedMessages = [...selectedChat.messages, { role: 'user', content: inputMessage }];
        setSelectedChat({ ...selectedChat, messages: updatedMessages });
        setInputMessage('');

        // Fetch AI Response
        const botResponse = await fetchAIResponse(updatedMessages);
        const updatedChatWithBotReply = [...updatedMessages, { role: 'assistant', content: botResponse }];
        setSelectedChat({ ...selectedChat, messages: updatedChatWithBotReply });

        // Update chat history
        setChats(chats.map(chat => chat.id === selectedChat.id ? { ...chat, messages: updatedChatWithBotReply } : chat));
    };

    return (
        <div className={styles.homepageContainer}>
            {/* Chat Sidebar */}
            <div className={styles.chatSidebar}>
                <h4>Conversations</h4>
                <button className={styles.newChatButton} onClick={handleNewChat}>New Chat</button>
                {chats.map((chat) => (
                    <div 
                        key={chat.id} 
                        className={`${styles.chatItem} ${selectedChat?.id === chat.id ? styles.active : ''}`}
                        onClick={() => handleChatSelect(chat)}
                    >
                        <h5>{chat.date}</h5>
                        <p>{chat.title}</p>
                    </div>
                ))}
            </div>

            {/* Main Chat Window */}
            <div className={styles.mainContent}>
                <div className={styles.chatMessages}>
                    {selectedChat ? (
                        <>
                            <h3>{selectedChat.title}</h3>
                            {selectedChat.messages.map((msg, index) => (
                                <p key={index} className={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
                                    {msg.content}
                                </p>
                            ))}
                            {loading && <p className={styles.loadingText}>AI is typing...</p>}
                        </>
                    ) : (
                        <p>Select a chat to start messaging.</p>
                    )}
                </div>

                {/* Chat Input */}
                {selectedChat && (
                    <form onSubmit={handleSendMessage} className={styles.chatInputContainer}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className={styles.chatInput}
                            disabled={loading}
                        />
                        <button type="submit" className={styles.sendButton} disabled={loading}>
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
