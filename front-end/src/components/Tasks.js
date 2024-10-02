import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Tasks.css";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Task from "./task-service";

const ResizableLayout = ({ columns }) => {
  const [data, setData] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const task = new Task();
      const tasksUnderProject = await task.getTasks({ projectId: 2 });
      setTasks(tasksUnderProject);
    }
    fetchTasks();
  }, [])

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
                  // value="searchTerm"
                  // onChange={handleInputChange}
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
        {tasks.map((task, index) => (
          <div
            key={index}
            className="task-item"
            style={{ backgroundColor: "#304971", marginBottom: "20px" }}
          >
            <p>
              <Link to={`/task-manager/${task["id"]}`} state={{ task }}>{task["title"]}</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResizableLayout;
