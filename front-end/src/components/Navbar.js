import React from 'react';
import './Navbar.css';  // Import the custom CSS file

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <a className="navbar-brand" href="#">My App</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="http://your-projects-url.com" target="_blank" rel="noopener noreferrer">Projects</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="http://your-tasks-url.com" target="_blank" rel="noopener noreferrer">Tasks</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="http://your-performance-metrics-url.com" target="_blank" rel="noopener noreferrer">Performance Metrics</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
