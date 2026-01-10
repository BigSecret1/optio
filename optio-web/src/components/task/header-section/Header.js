import React from "react";
import { useEffect, useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";

import { Typography, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Chip } from "@mui/material";

import { TaskContext } from "../../../contexts/TaskContext.js";
import OptionMenu from "../../UI/OptionMenu.js";
import StatusIcon from "../StatusIcon.js";
import UpdateTaskStatus from "./UpdateTaskStatus.js";
import EllipsisWithSpacing from "../../UI/ThreeDots.js";
import EditTaskHeader from "./EditTaskHeader.js";
import { getAssigneeName } from "../../../util.js";

export default function Header({ taskId }) {
  /**
   * This component contains(parent component of)  all the child components which helps to build header
   * of an opened task.
   */

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
        {/* {isEditingTaskStatus === true ? (
          <UpdateTaskStatus taskId={taskId} />
        ) : (
          <StatusIcon status={task.status} />
        )} */}
        <Chip
          label={task.project.name}
          component={RouterLink}
          to={`/projects/${task.project.id}/tasks`}
          clickable
          variant="outlined"
          sx={{
            fontWeight: 500,
            fontSize: "0.95rem",
            height: 23,
            px: 0.1,
            marginTop: "5px",
            color: "yellow",
            borderColor: "yellow",
            "&:hover": {
              backgroundColor: "rgba(255, 215, 0, 0.08)",
            },
          }}
        />

        <div className="optionMenuEllipsContainer">
          <OptionMenu options={menuOptionsForTitleBox}>
            <EllipsisWithSpacing containerClass="optionDots" />
          </OptionMenu>
        </div>
      </div>
      <div className="taskTitle">
        <h3>{task.title}</h3>
      </div>

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "center",
          gap: 2, // adds spacing between items
          color: "lightblue",
          flexWrap: "wrap", // allows wrap on small screens
        }}
      >
        <Box component="span" sx={{ fontWeight: 500, color: "#fff" }}>
          Status:
        </Box>

        <Box component="span" sx={{ mr: 2 }}>
          {task.status}
        </Box>
        <Box component="span" sx={{ fontWeight: 500, color: "#fff" }}>
          Assignee:
        </Box>

        <Box component="span">{getAssigneeName(task)}</Box>
      </Typography>

      {isEditingTaskHeader === true ? <EditTaskHeader taskId={taskId} /> : null}
    </Box>
  );
}
