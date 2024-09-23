import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

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
            console.log(`Received message: `, message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.off('message');
        };
    }, []);

    const handleSendMessage = () => {
        if (input.trim() && username && roomId) {
            console.log(`Sending message: ${input} to room: ${roomId}`);

        const message = {
            author: username,
            body: input,
            roomId,
        };

        // Emit the message to the WebSocket server
        socket.emit('message', message);
        console.log(`Received message: ${message.author} in ${message.roomId} received message ${message.body}`);
        // Immediately append the message to the current list of messages
        // setMessages((prevMessages) => [...prevMessages, message]); // immediately render out the message I just sent
            
        setInput('');
        }
    };

    /*const handleJoinChat = () => {
        if (username.trim()) {
            socket.emit('join', username);
            setJoined(true);
        }
    };*/
    
    const handleJoinRoom = async () => {
        if (username.trim()) {
            socket.emit('join', { username, roomId });
            setJoined(true);

            // Fetch messages for the room from the backend
            try {
                const response = await axios.get(`http://localhost:3001/messages/room/${roomId}`);
                console.log('Fetched messages: ', response.data);
                setMessages(response.data); // Set messages to the response from the backend
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
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
                            {msg.author !== 'System' && msg.author !== username && (
                                <strong>{msg.author}</strong>
                            )}
                            {" "}{msg.body}
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
