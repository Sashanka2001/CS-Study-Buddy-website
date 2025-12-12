import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import TodoList from './components/TodoList';
import Notes from './components/Notes';
import Schedule from './components/Schedule';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/todos" replace />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
