import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import PrivateRoute from './PrivateRoute'; 

const AuthProvider = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>Redirecting...</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export { AuthProvider };
