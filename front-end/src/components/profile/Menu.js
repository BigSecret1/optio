import React, { useState, useRef, useEffect, useContext } from "react";

import "./styles/Create.css";

export default function Create() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="create-container">
      <div
        className="create-dropdown-button"
        onClick={toggleDropdown}
        ref={dropdownRef}
      >
        <span className="plus-icon">+</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="create-dropdown-options">
          <ul>
            <li>
              <button
                onClick={() => {
                  setOpenCreateProject(true);
                }}
              >
                Project
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setOpenCreateTask(true);
                }}
              >
                Task
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
