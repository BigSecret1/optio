import React from "react";
import { useParams } from "react-router-dom";

function TaskManager() {
  const {task_id} = useParams();
  console.log("TASK ID : ", task_id);
  return <h1> This is task manager with id {task_id} </h1>;
}

export default TaskManager;