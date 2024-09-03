import React, { useEffect, useState} from 'react';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [editRowID, setEditRowID] = useState(null);

    // fetch users data from the backend
    useEffect(() => {
        axios.get('http://localhost:3001/users')
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the users.', error);
        });
    }, []); 

    const handleEditClick = (id) => {
        setEditRowID(id);
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSaveClick = (id) => {
        const user = users.find(user => user.id === id);

        // Validate email format using RegEx
        if (!emailPattern.test(user.email)) {
            alert('Email 格式錯誤，請重新輸入。\nInvalid email format. Please enter a valid email address.');
            return;
        }

        const isDuplicateEmail = users.some(u => u.email === user.email && u.id !== id);
        if (isDuplicateEmail) {
            alert('Email 已有人使用，請重新輸入。\nEmail is already in use. Please enter a different email address.');
            return ;
        }

        // save the updated data
        axios.patch(`http://localhost:3001/users/${id}`, {
            name: user.name,
            email: user.email,
            role: user.role,
        })
        .then(() => {
            setEditRowID(null); // exit the edit mode
        })
        .catch(error => {
            console.error('There was an error updating the user data.', error);
        });
    };

    const handleInputChange = (id, field, value) => {
        setUsers(users.map(user => user.id === id ? {...user, [field]: value} : user));
    };

    const handleAddNewUser = () => {
        axios.post('http://localhost:3001/users', {
            name: 'New user',
            email: 'newuser@example.com',
            role: 'SALES',
        })
        .then(response => {
            setUsers([...users, response.data]);
            setEditRowID(response.data.id); // automatically switch to edit mode for the new user
        })
        .catch(error => {
            console.error('There was an error adding a new user.' , error);
        });
    }

    return (
        <div>
            <button className="add-user-button" onClick={handleAddNewUser}>
                Add New User
            </button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Edit/Save</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key = {user.id}>
                            <td>{user.id}</td>
                            <td>
                                {editRowID === user.id ? 
                                (<input 
                                    type = "text" 
                                    value = {user.name} 
                                    maxLength = {15}
                                    onChange = {
                                        (e) => handleInputChange(user.id, 'name', e.target.value)
                                    }
                                />)
                                : (user.name)}
                            </td>
                            <td>
                                {editRowID === user.id ? 
                                (<input 
                                    type = "email" 
                                    value = {user.email}
                                    maxLength = {25}
                                    onChange = {
                                        (e) => handleInputChange(user.id, 'email', e.target.value)
                                    }
                                />)
                                : (user.email)}
                            </td>
                            <td>
                                {editRowID === user.id ? 
                                (<select 
                                    value = {user.role} 
                                    onChange = {
                                        (e) => handleInputChange(user.id, 'role', e.target.value)
                                    }
                                >
                                    <option value="SALES">SALES</option>
                                    <option value="CLIENT">CLIENT</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>)
                                : (user.role)}
                            </td>
                            <td>
                                {editRowID === user.id ? 
                                (<button onClick = {() => handleSaveClick(user.id)} 
                                         disabled = {!user.email || user.email === 'newuser@example.com'} // Disable save if default email
                                >
                                    Save</button>)
                                : (<button onClick = {() => handleEditClick(user.id)}>Edit</button>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable;