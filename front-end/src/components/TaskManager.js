import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Task from "../services/task/task-service";
import ShowTask from "./task/ShowTask";
import Navbar from "./navbar/Navbar";
import { TaskProvider } from "../contexts/TaskContext";

function TaskManager() {
  const location = useLocation();
  const { task } = location.state;
  const taskInstace = new Task(
    task.title,
    task.project_id,
    task.id,
    task.subtasks,
    task.due_date,
    task.comments,
    task.description,
    task.task_status
  );

  return (
    <>
      <TaskProvider>
        <Navbar />
        <ShowTask taskId={taskInstace.id} />
      </TaskProvider>
    </>
  );
}

export default TaskManager;
