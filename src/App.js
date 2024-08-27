import React from 'react';
import './App.css';
import UserTable from './components/userTable';

function App() {
  return (
    <div className='app-container'>
      <h1>User Management</h1>
      <UserTable/>
    </div>
  )
}

export default App;
