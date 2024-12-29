import React from "react";
import { useEffect, useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import { TaskContext } from "../../../contexts/TaskContext.js";
import EllipsisWithSpacing from "../../UI/ThreeDots.js";
import OptionMenu from "../../UI/OptionMenu.js";
import StatusIcon from "../StatusIcon.js";

export default function SubTasks({ taskId }) {
  const { task, subTasks, isWaitingForSubTasks, refreshSubTasks } =
    useContext(TaskContext);

  const menuOptionsForTitleBox = ["Create Subtask"];

  useEffect(() => {
    refreshSubTasks(taskId);
  }, [taskId]);

  console.log("Is it waiting for subtassk to load ? ", isWaitingForSubTasks);

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
          <OptionMenu options={menuOptionsForTitleBox}>
            <EllipsisWithSpacing containerClass="optionDots" />
          </OptionMenu>
        </div>
      </div>

      {isWaitingForSubTasks === false ? (
        subTasks.map((subTask) => {
          return (
            <div key={subTask.id}>
              <h6>
                <StatusIcon status={subTask.task_status} />{" "}
                HardcodedProjectName/{subTask.id}
                {subTask.title}
              </h6>
            </div>
          );
        })
      ) : (
        <p>Loading SubTasks</p>
      )}
    </Box>
  );
}
