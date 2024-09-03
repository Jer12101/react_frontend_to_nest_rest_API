import React from 'react';
import './App.css';
import UserTable from './components/userTable';
import Chat from './components/chat';

function App() {
  return (
    <div className='app-container'>
      <h1>User Management and Chat Application</h1>
      <div className='layout-container'>
        <UserTable />
        <Chat />
      </div>
    </div>
  )
}

export default App;
