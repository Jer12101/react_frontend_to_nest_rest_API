import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

//const socket = io('ws://192.168.11.142:3001');
const socket = io('ws://localhost:3001');

// Triggering disconnect on window unload (like when the page is closed)
window.addEventListener('beforeunload', () => {
    socket.disconnect();
});

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
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
        if (input.trim() && username && roomId) {
            console.log(`Sending message: ${input} to room: ${roomId}`);
            
            // Emit the message with roomId included
            socket.emit('message', {
                author: username,
                body: input,
                roomId, // Include roomId in the payload
            });
            
            setInput('');
        }
    };

    /*const handleJoinChat = () => {
        if (username.trim()) {
            socket.emit('join', username);
            setJoined(true);
        }
    };*/
    
    const handleJoinRoom = () => {
        if (username.trim()) {
            socket.emit('join', { username, roomId });
            setJoined(true);
        }
    };
    
    const handleLeaveRoom = () => {

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
                    <input
                        type = "text"
                        placeholder = "Enter the room ID"
                        value = {roomId}
                        onChange = { (e) => setRoomId(e.target.value)}
                    />
                    <button onClick={handleJoinRoom}>Join Room</button>
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
                            {msg.author !== 'System' && msg.author !== username && (<strong>{msg.author}</strong>)}{" "}
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
