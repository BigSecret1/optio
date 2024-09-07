import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Tasks.css";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Task from "./TaskEntity";

const ResizableLayout = ({ columns }) => {
  const data = [
    {
      title: "Add route with task id to task divs",
      project_id: 7,
      id: 1,
      subtasks: ["some or other tasks to perform", "Implement fixes"],
      due_date: "2024-06-24",
      comments: ["make task as pending task", "Coordinate with QA for testing"],
      description: "Addressing reported bugs in the application",
      task_status: "Running",
    },
    {
      title: "Create a TaskForm componenet to edit and update the task",
      project_id: 7,
      id: 2,
      subtasks: ["some or other tasks to perform", "Implement fixes"],
      due_date: "2024-06-24",
      comments: ["make task as pending task", "Coordinate with QA for testing"],
      description: "Addressing reported bugs in the application",
      task_status: "Pending",
    },
    {
      title: "Task uder project7 number 2",
      project_id: 7,
      id: 3,
      subtasks: ["some or other tasks to perform", "Implement fixes"],
      due_date: "2024-06-24",
      comments: ["make task as pending task", "Coordinate with QA for testing"],
      description: "Addressing reported bugs in the application",
      task_status: "Pending",
    },
  ];

  const taskEntites = new Task();

  const [searchTerm, setSearchTerm] = useState(null);
  useEffect(() => {
    const filterTasks = () => {
      console.log("Searching for the task");
    };

    if (searchTerm) {
      filterTasks();
    }
  }, [searchTerm]);

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setSearchTerm(newText);
  };

  return (
    <div className="resizable-layout-container">
      {/* Create responsive panels with input of text type */}
      <PanelGroup direction="horizontal">
        {columns.map((col, index) => {
          return (
            <React.Fragment key={index}>
              <Panel className="panel">
                <h2>{col}</h2>
                <input
                  value="searchTerm"
                  onChange={handleInputChange}
                  type="text"
                  placeholder={`Enter ${col} details...`}
                />
              </Panel>

              {index < columns.length - 1 && (
                <PanelResizeHandle className="resize-handle inactive" />
              )}
            </React.Fragment>
          );
        })}
      </PanelGroup>

      {/* List all tasks  */}
      <div className="dialogue-box">
        {data.map((task, index) => (
          <div
            key={index}
            className="task-item"
            style={{ backgroundColor: "#304971", marginBottom: "20px" }}
          >
            <p>
              <Link to={`/task-manager/${task["id"]}`} state={{task}}>{task["title"]}</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResizableLayout;
