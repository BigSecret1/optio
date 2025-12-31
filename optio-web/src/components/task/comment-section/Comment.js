import React from "react";
import { useEffect, useState, createContext, useContext } from "react";

import { TaskContext } from "../../../contexts/TaskContext";
import CommentService from "../../../comment/index";
import { TextBox, SubmitButton, CancelButton } from "../../common";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography, Divider, IconButton, Stack } from "@mui/material";

export default function Comment({ taskId }) {
  const { task, getUpdatedTask } = useContext(TaskContext);
  const [newComment, setNewComment] = useState("");

  async function handleAddComment(e) {
    e.preventDefault();
    CommentService.addComment(newComment, taskId);
    getUpdatedTask(taskId);
    setNewComment("");
  }

  function handleChange(e) {
    setNewComment(e.target.value);
  }

  return (
    <Box
      component="form"
      onSubmit={handleAddComment}
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
          <TextBox handleChange={handleChange} value={newComment} />
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
              key={index}
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
                    {commentObject.firstName} {commentObject.lastName}
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
                  <FontAwesomeIcon icon={faEdit} style={{ marginRight: 10 }} />
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
  );
}
