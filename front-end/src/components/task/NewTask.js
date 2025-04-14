import React, { useState } from "react";

import "./styles/new-task.css";

export default function NewTask() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    console.log("Form Submitted:", { name, description });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Form</button>
      {isOpen && (
        <div className="task-dialog-overlay">
          <div className="task-dialog-box">
            <h2>Task</h2>
            <form>
              <div className="task-form-scrollable">
                <div className="task-form-group">
                  <label htmlFor="name">Title</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="task-form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="task-form-group">
                  <label for="dropdown">Status</label>
                  <select id="dropdown" name="options">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="task-form-actions">
                <button type="button" onClick={handleCreate}>
                  Create
                </button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
