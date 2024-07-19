import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ToDoList from './components/ToDoList';
import Login from './components/Login';
import Signup from './components/Signup';

const App = ({ tasks, categories }) => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<ToDoList tasks={tasks} categories={categories} />} />
      {/* Add other routes as needed */}
    </Routes>
  </Router>
);

export default App;