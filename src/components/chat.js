import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.off('message');
        };
    }, []);

    const handleSendMessage = () => {
        if (input.trim() && username) {
            console.log(`Sending message: ${input}`);
            socket.emit('message', { author: username, body: input });
            setInput('');
        }
    };

    const handleJoinChat = () => {
        if (username.trim()) {
            socket.emit('join', username);
            setJoined(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className = "chat-container">
            <h2> Chat App </h2>
            {!joined ? (
                // If the user hasn't joined the chat room
                <div>
                    <input
                        type = "text"
                        placeholder = "Enter your username"
                        value = {username}
                        onChange = { (e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleJoinChat}>Join Chat</button>
                </div>   
            ):(
                // If the user has joined the chat room
                // always remember what the add-message.dto contains, an author and a 'body'
                <div>
                    <div className = "chat-window">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.author === 'System' 
                                    ? 'system-message' : msg.author === username
                                    ? 'my-message'
                                    : 'other-message'
                                }`}
                            >
                            {msg.author !== 'System' && msg.author !== username && (<strong>{msg.author}:</strong>)}{" "}
                            {msg.body}
                            </div>
                        ))}
                        <input
                            type = "text"
                            placeholder = "Type a message"
                            value = {input}
                            onChange = {(e) => setInput(e.target.value)}
                            onKeyDown = {handleKeyDown}
                        />
                        <button onClick = {handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
