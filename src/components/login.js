import React, { useState } from 'react';
import axios from 'axios'; // To handle backend communication for creating users

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleLogin = async () => {
        if (username.trim()) {
            try {
                // Check if username exists or create a new one in the database
                const response = await axios.post('/api/users/login', { username });
                onLogin(response.data); // Pass the user data back to the parent
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
