import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";

import Task from "../../../services/task/task-service";
import { TaskContext } from "../../../contexts/TaskContext";
import { TASK_STATUS } from "../../../constants";
import "./styles/edit-task-header.css";
import { searchContext, userSearchStrategy } from "../../../search/index";
import { getAssigneeName } from "../../../util";
import { useUser } from "../../../contexts/UserContext";

import {
  FormTextField,
  FormSelectField,
  CancelButton,
  SubmitButton,
} from "../../common";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e6edf3",
    "& fieldset": { borderColor: "#90caf9" },
    "&:hover fieldset": { borderColor: "#64b5f6" },
    "&.Mui-focused fieldset": { borderColor: "#2196f3" },
  },
};

const labelSx = {
  color: "white",
  mb: 0.75,
  "&.Mui-focused": { color: "#2196f3" },
};

const selectSx = {
  color: "#e6edf3",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#90caf9" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#64b5f6" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2196f3",
  },
};

export default function EditTaskHeader({ taskId }) {
  const { user, logout } = useUser();
  const { task, setIsEditingTaskHeader, isEditingTaskHeader, getUpdatedTask } =
    useContext(TaskContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState(task?.assignee || "");
  const anchorRef = useRef(null);
  const [taskHeaders, setTaskHeaders] = useState({
    title: task.title,
    assignee: getAssigneeName(task),
    status: task.status,
  });
  const [assigneeId, setAssigneeId] = useState(user.id);
  const task_actions = new Task();

  useEffect(() => {}, [task]);

  function handleTitleChange(e) {
    setTaskHeaders((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  }

  function handleStatusSelection(e) {
    setTaskHeaders((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (name === "assignee") {
      search(value);
    }
    setTaskHeaders((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function search(input) {
    if (!input) {
      setSearchResults([]);
      return;
    }
    searchContext.setStrategy(userSearchStrategy);
    const query = { firstName: input };
    const results = await searchContext.executeSearch(query);
    setSearchResults(results);
    setShowDropdown(true);
  }

  function handleAssigneeSelect(newAssignee) {
    setTaskHeaders((prev) => ({
      ...prev,
      assignee: `${newAssignee.firstName} ${newAssignee.lastName}`,
    }));
    setAssigneeId(newAssignee.id);
    setQuery(newAssignee.firstName);
    setShowDropdown(false);
  }

  function handleSave(e) {
    const data = {
      id: task.id,
      title: taskHeaders.title,
      assigneeId: assigneeId,
      status: taskHeaders.status,
    };

    console.log("task payload ", data);
    task_actions.updateTask(data);
    setIsEditingTaskHeader(false);
    getUpdatedTask(task.id);
  }

  function handleCancel() {
    setIsEditingTaskHeader(false);
  }

  return (
    <Dialog
      open={isEditingTaskHeader}
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
      <DialogContent sx={{ maxHeight: "60vh", overflowY: "auto" }}>
        <FormTextField
          id="title"
          label="Title"
          value={taskHeaders.title}
          onChange={handleTitleChange}
          textFieldSx={textFieldSx}
          labelSx={labelSx}
        />

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label htmlFor="assignee">Assignee</label>

          <FormTextField
            id="assignee"
            value={taskHeaders.assignee}
            onChange={handleInputChange}
            textFieldSx={textFieldSx}
            textFieldProps={{
              inputRef: anchorRef,
              name: "assignee",
              placeholder: "Search user...",
              type: "text",
              variant: "outlined",
              size: "small",
              autoComplete: "off",
              onBlur: () => setTimeout(() => setShowDropdown(false), 200),
              onFocus: () => {
                if (searchResults.length) setShowDropdown(true);
              },
            }}
          />

          <Popper
            open={showDropdown && searchResults.length > 0}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            style={{
              zIndex: 1300,
              width: anchorRef.current?.offsetWidth || 300,
            }}
          >
            <Paper elevation={3}>
              <List dense style={{ maxHeight: 240, overflowY: "auto" }}>
                {searchResults.map((item) => (
                  <ListItem
                    key={item.id}
                    disablePadding
                    onMouseDown={() => handleAssigneeSelect(item)}
                    style={{ borderBottom: "0.2px solid black" }}
                  >
                    <ListItemButton>
                      <ListItemText
                        primary={`${item.firstName ?? ""} ${
                          item.lastName ?? ""
                        }`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Popper>
        </div>

        <FormSelectField
          label="Status"
          labelId="status-label"
          value={taskHeaders.status}
          onChange={handleStatusSelection}
          options={TASK_STATUS}
          labelSx={labelSx}
          selectSx={selectSx}
          displayEmpty
          inputId="task-status"
        />
      </DialogContent>

      <DialogActions>
        <CancelButton onClose={handleCancel} />
        <SubmitButton actionText="Save" />
      </DialogActions>
    </Dialog>
  );
}
