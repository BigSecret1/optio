import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Task from "../services/task/task-service";
import ShowTask from "./task/ShowTask";
import Navbar from "./navbar/Navbar";
import { TaskContext, TaskProvider } from "../contexts/TaskContext";

export default function TaskManager() {
  const { taskId } = useParams();

  return (
    <TaskProvider taskId={taskId}>
      <Navbar />
      <ShowTask />
    </TaskProvider>
  );
}
