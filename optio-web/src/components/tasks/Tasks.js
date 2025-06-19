import React, { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Task from "../../services/task/task-service";
import "../../styles/Tasks.css";

function Tasks({ projectTasks = [] }) {
  console.log("Received project from ProjecTasks component ", projectTasks);
  const searchOptions = ["Task", "Status", "Assignee"];
  const task = new Task();
  const [tasks, setTasks] = useState([]);
  const hasSetProjectTasks = useRef(false);

  useEffect(() => {
    async function fetchTasks() {
      const allTasks = await task.getTasks();
      console.log("Calling if no tasks received from parent");
      setTasks(allTasks);
    }
    console.log(projectTasks.length);

    if (projectTasks.length && !hasSetProjectTasks.current) {
      console.log("Setting received projectTasks to task state");
      setTasks(projectTasks);
      hasSetProjectTasks.current = true;
    } else if (!hasSetProjectTasks.current && projectTasks.length == 0) {
      console.log("I don't have any project", projectTasks);
      fetchTasks();
    }
  }, []);

  async function handleSearch(event) {}

  return (
    <div className="resizable-layout-container">
      {/* Create responsive panels with input of text type */}
      <PanelGroup direction="horizontal">
        {searchOptions.map((col, index) => {
          return (
            <React.Fragment key={index}>
              <Panel className="panel">
                <h2>{col}</h2>
                <input
                  onChange={handleSearch}
                  type="text"
                  name={col}
                  placeholder={`Enter ${col} details...`}
                />
              </Panel>

              {index < searchOptions.length - 1 && (
                <PanelResizeHandle className="resize-handle inactive" />
              )}
            </React.Fragment>
          );
        })}
      </PanelGroup>

      <div className="dialogue-box">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="task-item"
            style={{ backgroundColor: "#304971", marginBottom: "20px" }}
          >
            <p>
              <Link to={`/task-manager/${task["id"]}`} state={{ task }}>
                {task["title"]}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
