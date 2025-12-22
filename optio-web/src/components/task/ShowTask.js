import React from "react";
import { useEffect, useState, createContext, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography, Divider, IconButton, Stack } from "@mui/material";

import { TaskContext } from "../../contexts/TaskContext.js";
import "../../styles/ShowTask.css";
import { TextBox, SubmitButton, CancelButton } from "../common";
import Header from "./header-section/Header.js";
import Description from "./description-section/Description.js";
import SubTasks from "./subtasks-section/SubTasks.js";

/**
 * The primary component which is responsible to show an opened task.
 * All the child components are divded into different section for e.g.
 * header-section, descriptio-sectioin etc.
 */
export default function ShowTasks({ taskId }) {
  const { task, setTask, loading, setLoading, taskService, getUpdatedTask } =
    useContext(TaskContext);

  /**
   * Good way handling the task state as it is dependant on taskId change,
   * Otherwise direct invoking of getUpdatedTask function will lead to infinite
   * loop.
   * Also it's pulling task and updating task state during component mouting
   */
  useEffect(() => {
    getUpdatedTask(taskId);
    console.log("Fetched task is ", task);
  }, [taskId]);

  const [newComment, setNewComment] = useState("");

  async function handleAddComment() {
    taskService.updateTask({ id: taskId, comments: [newComment] });
    getUpdatedTask(taskId);
    setNewComment("");
  }

  return loading ? (
    <p>Loading Task...</p>
  ) : (
    <div style={{ width: "100%" }}>
      <Header taskId={taskId} />
      <Description taskId={taskId} />
      <SubTasks taskId={taskId} />

      <Box
        sx={[
          (theme) => ({
            display: "flex",
            m: 1,
            p: 1,
            minHeight: "49vh",
            height: "auto",
            bgcolor: "#304971",
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
        <div className="comments">
          <h3>Comments</h3>

          <div className="commentBox">
            <TextBox />
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <SubmitButton actionText="Add Comment" />
            </Box>
          </div>

          {task.comments.map((commentObject, index) => {
            return (
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Stack direction="row" alignItems="baseline" spacing={1.5}>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "white",
                        fontWeight: 500,
                      }}
                    >
                      Dinesh Kumar
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "white",
                        position: "relative",
                        top: 2,
                      }}
                    >
                      Last Update: {commentObject.createdAt}
                    </Typography>
                  </Stack>

                  <IconButton
                    size="small"
                    sx={{
                      color: "white",
                      p: 0.5,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ marginRight: 10 }}
                    />
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Stack>

                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {commentObject.comment}
                </Typography>
              </Box>
            );
          })}
        </div>
      </Box>
    </div>
  );
}
