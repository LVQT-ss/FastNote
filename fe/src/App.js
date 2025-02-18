import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateNote from './components/CreateNote';
import ViewNote from './components/ViewNote';
import AccessNote from './components/AccessNote';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Notes App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CreateNote />} />
            <Route path="/access" element={<AccessNote />} />
            <Route path="/note/:code" element={<ViewNote />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2025 Notes App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;