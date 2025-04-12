import React, { useState, useRef, useEffect } from "react";

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
              <button onClick={() => console.log("New repository")}>
                Project
              </button>
            </li>
            <li>
              <button onClick={() => console.log("Import repository")}>
                Task
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
