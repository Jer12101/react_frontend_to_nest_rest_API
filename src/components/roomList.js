import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomList = ({ currentRoom, onRoomSelect, socket }) => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Fetch available rooms and users
        const fetchRooms = async () => {
            try {
                const response = await axios.get('/api/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            }
        };

        fetchRooms();

        // Listen for room updates from the server
        socket.on('roomsUpdated', fetchRooms);

        return () => {
            socket.off('roomsUpdated', fetchRooms);
        };
    }, [socket]);

    return (
        <div className="room-list">
            <h3>Rooms</h3>
            <ul>
                {rooms.map((room) => (
                    <li 
                        key={room.id} 
                        className={room.id === currentRoom ? 'active' : ''} 
                        onClick={() => onRoomSelect(room.id)}
                    >
                        {room.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomList;
