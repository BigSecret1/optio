import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import Task from "../../../services/task/task-service";
import { TaskContext } from "../../../contexts/TaskContext";
import { TASK_STATUS } from "../../../constants";
import "./styles/edit-task-header.css";
import { searchContext, userSearchStrategy } from "../../../search/index";

export default function EditTaskHeader({ taskId }) {
  const { task, setIsEditingTaskHeader, isEditingTaskHeader, getUpdatedTask } =
    useContext(TaskContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState(task?.assignee || "");
  const anchorRef = useRef(null);
  const [taskHeaders, setTaskHeaders] = useState({
    title: task.title,
    assignee: `${task.assignee.firstName} ${task.assignee.lastName}` || "",
    status: task.status,
  });
  const [assigneeId, setAssigneeId] = useState(task.assignee.id);

  const task_actions = new Task();

  useEffect(() => {}, [task]);

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

  function handleAssigneeSelect(user) {
    setTaskHeaders((prev) => ({
      ...prev,
      assignee: `${user.firstName} ${user.lastName}`,
    }));
    setAssigneeId(user.id);
    setQuery(user.firstName);
    setShowDropdown(false);
  }

  function handleSave(e) {
    const data = {
      id: task.id,
      title: taskHeaders.title,
      assigneeId: assigneeId,
      status: taskHeaders.status,
    };

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
      <DialogContent
        className="edit-header-dialog-content"
        sx={{ maxHeight: "60vh", overflowY: "auto" }}
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

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label htmlFor="assignee">Assignee</label>
          <TextField
            inputRef={anchorRef}
            value={taskHeaders.assignee}
            onChange={handleInputChange}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onFocus={() => {
              if (searchResults.length) setShowDropdown(true);
            }}
            type="text"
            name="assignee"
            placeholder="Search user..."
            fullWidth
            variant="outlined"
            size="small"
            autoComplete="off"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
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

        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status-select"
          name="status"
          value={taskHeaders.status}
          onChange={handleInputChange}
          fullWidth
          sx={{
            color: "white",
            backgroundColor: "#304971",
            borderRadius: "6px",
            "& .MuiOutlinedInput-notchedOutline": {
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
          style={{
            color: "white",
            backgroundColor: "#304971",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          style={{
            color: "white",
            backgroundColor: "#304971",
            fontWeight: 600,
            marginLeft: "10px",
            textTransform: "none",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
