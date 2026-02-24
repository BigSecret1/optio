import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Tasks from "./Tasks";
import Task from "../../services/task/task-service";

export default function AllProjectTasks() {
  const [tasks, setTasks] = useState([]);
  const taskAction = new Task();

  useEffect(() => {
    async function fetchTasks() {
      const result = await taskAction.getTasks();
      setTasks(result);
    }
    fetchTasks();
  }, []);

  return (
    <>{tasks.length === 0 ? <p>Loading ...</p> : <Tasks tasks={tasks} />}</>
  );
}
