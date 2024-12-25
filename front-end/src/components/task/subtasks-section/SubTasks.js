import React from "react";
import { useEffect, useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import { TaskContext } from "../../../contexts/TaskContext.js";

import EllipsisWithSpacing from "../../UI/ThreeDots.js";

export default function SubTasks({ taskId }) {
  const { task } = useContext(TaskContext);

  return (
    <Box
      sx={[
        (theme) => ({
          display: "flex",
          flexDirection: "column",
          m: 1,
          p: 1,
          // minHeight: '40vh',
          // height: 'auto',
          bgcolor: "#304971",
          position: "relative",
          color: "white",
          border: "0.5px solid",
          borderColor: "#3F5880",
          borderRadius: 2,
          fontSize: "0.875rem",
          fontWeight: "700",
          ...theme.applyStyles("dark", {
            bgcolor: "#101010",
            color: "white",
            // borderColor: 'grey.800',
          }),
        }),
      ]}
    >
      <div className="subTaskHeader">
        <h3>SubTasks</h3>
        <div className="optionMenuEllipsContainer">
          <EllipsisWithSpacing containerClass="optionDots" />
        </div>
      </div>

      <div className="subTasksContainer">
        <div className="subTasks">
          {task.subtasks.map((subtask, index) => {
            return (
              <div className="taskItem" key={index}>
                <input type="checkbox" />
                <h5>{subtask}</h5>
              </div>
            );
          })}
        </div>
      </div>
    </Box>
  );
}
