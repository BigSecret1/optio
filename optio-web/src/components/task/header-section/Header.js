import React from "react";
import { useEffect, useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import { TaskContext } from "../../../contexts/TaskContext.js";
import OptionMenu from "../../UI/OptionMenu.js";
import StatusIcon from "../StatusIcon.js";
import UpdateTaskStatus from "./UpdateTaskStatus.js";
import EllipsisWithSpacing from "../../UI/ThreeDots.js";
import EditTaskHeader from "./EditTaskHeader.js";

/**
 * This component contains(parent component of)  all the child components which helps to build header
 * of an opened task.
 */
export default function Header({ taskId }) {
  const {
    task,
    isEditingTaskHeader,
    setIsEditingTaskHeader,
    isEditingTaskStatus,
    setIsEditingTaskStatus,
    optionToState,
  } = useContext(TaskContext);

  const menuOptionsForTitleBox = ["Edit"];
  optionToState.set("Edit", setIsEditingTaskHeader);

  return (
    <Box
      sx={[
        (theme) => ({
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          m: 1,
          p: 1,
          minHeight: "10vh",
          height: "auto",
          bgcolor: "#304971",
          color: "white",
          border: "0.5px solid",
          borderColor: "#3F5880",
          borderRadius: 2,
          fontSize: "0.875rem",
          fontWeight: "700",
          ...theme.applyStyles("dark", {
            // bgcolor: '#101010',
            color: "white",
            // borderColor: 'grey.800',
          }),
        }),
      ]}
    >
      <div className="taskTitleHeader">
        {isEditingTaskStatus === true ? (
          <UpdateTaskStatus taskId={taskId} />
        ) : (
          <StatusIcon status={task.status} />
        )}
        <Link>
          <h5>GSMI/1248</h5>
        </Link>
        <p>
          Assigee : {task.assignee.firstName} {task.assignee.lastName}
        </p>
        <div className="optionMenuEllipsContainer">
          <OptionMenu options={menuOptionsForTitleBox}>                       
            <EllipsisWithSpacing containerClass="optionDots" />
          </OptionMenu>
        </div>
      </div>
      <div className="taskTitle">
        <h3>{task.title}</h3>
      </div>
      {isEditingTaskHeader === true ? <EditTaskHeader taskId={taskId} /> : null}
    </Box>
  );
}
