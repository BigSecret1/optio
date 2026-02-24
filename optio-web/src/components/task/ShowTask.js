import React from "react";
import { useEffect, useState, createContext, useContext } from "react";

import { TaskContext } from "../../contexts/TaskContext.js";
import "../../styles/ShowTask.css";
import Header from "./header-section/Header";
import Comment from "./comment-section/Comment.js";
import Description from "./description-section/Description";
import SubTasks from "./subtasks-section/SubTasks";

export default function ShowTask() {
  const { task } = useContext(TaskContext);

  return !task ? (
    <p>Loading Task...</p>
  ) : (
    <div style={{ width: "100%" }}>
      <Header />
      <Description />
      <SubTasks />
      <Comment />
    </div>
  );
}
