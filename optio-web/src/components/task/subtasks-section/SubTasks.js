import React, { useEffect, useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Box, Stack, Typography } from "@mui/material";

import { TaskContext } from "../../../contexts/TaskContext.js";
import EllipsisWithSpacing from "../../UI/ThreeDots.js";
import OptionMenu from "../../UI/OptionMenu.js";
import NewTask from "../NewTask.js";
import ApiManager from "../../../api-client/api-manager";

export default function SubTasks() {
  const { task, refreshSubTasks, subTasks } = useContext(TaskContext);
  const [openNewTask, setOpenNewTask] = useState(false);

  useEffect(() => {
    if (task?.id) {
      refreshSubTasks(task.id);
    }
  }, [task?.id]);

  function handleMenuSelect(option) {
    if (option.toLowerCase() === "create subtask") {
      setOpenNewTask(true);
    }
  }

  function handleCloseNewTaskDialogue() {
    setOpenNewTask(false);
  }

  async function handleCreateSubtask(data) {
    await ApiManager.createTask(data);
    refreshSubTasks(task.id);
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
        parentTaskId={task.id}
        projectId={task?.project?.id}
        taskData={{ title: "", description: "", status: "" }}
        dialogueTitle="Create Subtask"
      />

      {/* Subtasks List */}
      <Stack spacing={1.5} mt={2}>
        {subTasks && subTasks.length > 0 ? (
          subTasks.map((subtask, index) => (
            <Stack
              key={subtask.id}
              component={RouterLink}
              to={`/tasks/${subtask.id}`}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                textDecoration: "none",
                color: "white",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: 1,
                },
                p: 0.5,
              }}
            >
              <Typography
                key={subtask.id ?? index}
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "white",
                }}
              >
                {subtask.title}
              </Typography>
            </Stack>
          ))
        ) : (
          <Typography sx={{ opacity: 0.7 }}>No subtasks available</Typography>
        )}
      </Stack>
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
