import React, { useEffect, useState, useContext } from "react";

import Box from "@mui/material/Box";

import { TaskContext } from "../../../contexts/TaskContext.js";
import EllipsisWithSpacing from "../../UI/ThreeDots.js";
import OptionMenu from "../../UI/OptionMenu.js";
import NewTask from "../NewTask.js";    

export default function SubTasks({ taskId }) {
  const { task } = useContext(TaskContext);
  const [openNewTask, setOpenNewTask] = useState(false);

  useEffect(() => {}, [taskId]);

  function handleMenuSelect(option) {
    if (option.toLowerCase() === "create subtask") {
      setOpenNewTask(true);
    }
  }

  function handleCloseNewTaskDialogue() {
    setOpenNewTask(false);
  }

  async function handleCreateSubtask(payload) {
    console.log("Sending data to create new subtask", payload);
    setOpenNewTask(false);
  }

  return (
    <Box sx={subTaskBoxSx}>
      <div className="subTaskHeader">
        <h3>Sub Tasks</h3>

        {/* Cluster of components which allow to to click 3 dots and open option Menu */}
        <div className="optionMenuEllipsContainer">
          <OptionMenu options={["Create Subtask"]} onSelect={handleMenuSelect}>
            <EllipsisWithSpacing containerClass="optionDots" />
          </OptionMenu>
        </div>
      </div>
      {/* Render dialogue form to create new subtask */}
      <NewTask
        open={openNewTask}
        onClose={handleCloseNewTaskDialogue}
        onSubmit={handleCreateSubtask}
        parentTaskId={taskId}
        project={task?.project_id ?? 2}
        taskData={{ title: "", description: "", status: "" }}
      />
    </Box>
  );
}

function subTaskBoxSx(theme) {
  return {
    display: "flex",
    flexDirection: "column",
    m: 1,
    p: 1,
    minHeight: "30vh",
    height: "auto",
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
    }),
  };
}
