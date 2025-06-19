import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Tasks from "./Tasks";
import Task from "../../services/task/task-service";

function ProjectTasks() {
  const [tasks, setTasks] = useState([]);
  const task = new Task();
  const { projectId } = useParams();

  useEffect(() => {
    async function fetchTasks() {
      const projectTasks = await task.getTasks({ projectId: projectId });
      setTasks(projectTasks);
    }

    if (projectId) {
      fetchTasks();
    }
  }, []);

  return (
    <>
      {tasks.length === 0 ? <p>Loading ...</p> : <Tasks projectTasks={tasks} />}
    </>
  );
}

export default ProjectTasks;
