import React from "react";
import { useParams } from "react-router-dom";
import ShowTask from "./task/ShowTask";
import Navbar from "./navbar/Navbar";
import { TaskProvider } from "../contexts/TaskContext";

export default function TaskManager() {
  const { taskId } = useParams();

  return (
    <TaskProvider taskId={taskId}>
      <Navbar />
      <ShowTask />
    </TaskProvider>
  );
}
