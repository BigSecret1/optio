import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// import bootstrap for the project
import 'bootstrap/dist/css/bootstrap.min.css';

// import custom components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Projects from './components/Projects';

const root = ReactDOM.createRoot(document.getElementById('root'));

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('access_token'); // Example check, can be adjusted
  return isAuthenticated ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

document.title = "ToDOler";

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
                  path="/projects" 
                  element={
                    <PrivateRoute>
                      <Projects />
                    </PrivateRoute>
                  } 
                />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals(console.log);
