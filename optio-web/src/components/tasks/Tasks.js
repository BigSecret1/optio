import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Task from "../../services/task/task-service";
import "../../styles/Tasks.css";

function Tasks() {
  const searchOptions = ["Task", "Status", "Assignee"];
  const task = new Task();

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await task.getTasks({ projectId: 2 });
      setTasks(allTasks);
    };
    fetchTasks();
  }, []);

  const [tasks, setTasks] = useState([]);
  const [searchByProject, setSearchByProject] = useState("");
  const [searchByTask, setSearchByTask] = useState("");
  const [searchByStatus, setSearchByStatus] = useState("");

  const handleSearch = async (event) => {
    const searchType = String(event.target.name).toLowerCase();
    const searchTasksWith = String(event.target.value).toLowerCase();

    const searchHandlers = {
      project: setSearchByProject,
      task: setSearchByTask,
      status: setSearchByStatus,
    };

    const searchHandler = searchHandlers[searchType];
    if (searchHandler) {
      searchHandler(searchTasksWith);
    }

    // Since state updates in React are not immediate, passing event value directly instead of relying on the state
    const searchedTasks = await task.search({
      task: searchType === "task" ? searchTasksWith : searchByTask,
      project: searchType === "assignee" ? searchTasksWith : searchByProject,
      status: searchType === "status" ? searchTasksWith : searchByStatus,
    });
    setTasks(searchedTasks);
  };

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
