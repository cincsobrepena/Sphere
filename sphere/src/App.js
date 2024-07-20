import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomeWrapper from './components/HomeWrapper';

const App = ({ tasks, categories }) => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<HomeWrapper tasks={tasks} categories={categories} />} />
      {/* Add other routes as needed */}
    </Routes>
  </Router>
);

export default App;