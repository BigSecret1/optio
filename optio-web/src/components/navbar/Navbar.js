import React from "react";
import { Link } from "react-router-dom";

import "../Navbar.css";
import ProfileMenu from "../profile/ProfileMenu";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <Link
        className="nav-link"
        to="/dashboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="optio-logo" src="/optio.svg" alt="Company Logo" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/projects/list"
              target="_blank"
              rel="noopener noreferrer"
            >
              Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/tasks"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tasks
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/quicknote"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quick notest
            </Link>
          </li>
        </ul>
        <ProfileMenu />
      </div>
    </nav>
  );
}

export default Navbar;
