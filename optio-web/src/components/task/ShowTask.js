import React from "react";
import { useEffect, useState, createContext, useContext } from "react";

import { TaskContext } from "../../contexts/TaskContext.js";
import "../../styles/ShowTask.css";
import Header from "./header-section/Header";
import Comment from "./comment-section/Comment.js";
import Description from "./description-section/Description";
import SubTasks from "./subtasks-section/SubTasks";

export default function ShowTasks({ taskId }) {
  /**
   * The primary component which is responsible to show an opened task.
   * All the child components are divded into different section for e.g.
   * header-section, descriptio-sectioin etc.
   */

  const { loading, getUpdatedTask } = useContext(TaskContext);

  /**
   * Good way handling the task state as it is dependant on taskId change,
   * Otherwise direct invoking of getUpdatedTask function will lead to infinite
   * loop.
   * Also it's pulling task and updating task state during component mouting
   */
  useEffect(() => {
    getUpdatedTask(taskId);
  }, [taskId]);

  return loading ? (
    <p>Loading Task...</p>
  ) : (
    <div style={{ width: "100%" }}>
      <Header taskId={taskId} />
      <Description taskId={taskId} />
      <SubTasks taskId={taskId} />
      <Comment taskId={taskId} />
    </div>
  );
}
