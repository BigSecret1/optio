import React from "react";
import { useEffect, useState, createContext, useContext } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import Task from "../../../services/task/task-service";
import { TaskContext } from "../../../contexts/TaskContext";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { TASK_STATUS } from "../../../constants";
import "./styles/edit-task-header.css";

export default function EditTaskHeader({ taskId }) {
  const { task, setIsEditingTaskHeader, taskService, getUpdatedTask } =
    useContext(TaskContext);

  const taskAction = new Task();

  const [taskHeaders, setTaskHeaders] = useState({
    title: task.title,
    assignee: "Admin", // needs to be changed by task.assignee
    status: task.status,
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setTaskHeaders((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave() {
    const data = {
      title: taskHeaders.title,
      assignee: taskHeaders.assignee,
      status: taskHeaders.status,
    };
    setIsEditingTaskHeader(false);
  }

  function handleCancel() {
    setIsEditingTaskHeader(false);
  }

  return (
    <div>
      <Dialog
        open={setIsEditingTaskHeader}
        onClose={handleCancel}
        PaperProps={{
          component: "form",
          onSubmit: handleSave,
          sx: {
            width: "1000px",
            maxWidth: "90vw",
            backgroundColor: "#3F5880",
          },
        }}
      >
        <DialogContent
          className="edit-header-dialog-content"
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskHeaders.title}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="Assignee">Assignee</label>
          <input
            type="text"
            id="assignee"
            name="assignee"
            value={taskHeaders.assignee}
            onChange={handleInputChange}
          />

          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            name="status"
            value={taskHeaders.status}
            onChange={handleInputChange}
            label="Status"
            sx={{
              color: "white",
              backgroundColor: "#304971",
              borderRadius: "6px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-icon": {
                color: "white",
              },
            }}
          >
            {TASK_STATUS.map((statusOption) => (
              <MenuItem
                key={statusOption}
                value={statusOption}
                sx={{
                  backgroundColor: "#304971",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#3F5880",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#3F5880",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#3F5880",
                  },
                }}
              >
                {statusOption}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCancel}
            variant="contained"
            disableElevation
            disableRipple
            disableFocusRipple
            style={{
              color: "white",
              backgroundColor: "#304971",
              border: "none",
              boxShadow: "none",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disableRipple
            disableFocusRipple
            style={{
              color: "white",
              backgroundColor: "#304971",
              border: "none",
              boxShadow: "none",
              textTransform: "none",
              fontWeight: 600,
              marginLeft: "10px",
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
