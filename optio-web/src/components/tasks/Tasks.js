import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Popper from "@mui/material/Popper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { Typography, Box } from "@mui/material";

import Task from "../../services/task/task-service";
import "../../styles/Tasks.css";
import { searchContext, taskSearchStrategy } from "../../search/index";
import { extractSearchResults } from "../../util";

function Tasks({ projectTasks = [] }) {
  const [searchType, setSearchType] = useState("Task");
  const task = new Task();

  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const hasSetProjectTasks = useRef(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  const anchorRef = useRef(null);

  useEffect(() => {
    if (projectTasks.length && !hasSetProjectTasks.current) {
      setTasks(projectTasks);
      hasSetProjectTasks.current = true;
    } else if (projectTasks.length === 0 && !hasSetProjectTasks.current) {
      fetchTasks();
    }
    console.log("Tasks ", tasks);
  }, []);

  async function fetchTasks() {
    const response = await task.getTasks();
    setTasks(response);
    setAllTasks(response);
  }

  function handleSearch(event) {
    const input = event.target.value;
    setQuery(input);
    if (input.trim() === "") {
      setTasks(allTasks);
      return;
    }
    search(input);
  }

  async function search(input) {
    const query = { title: input };

    searchContext.setStrategy(taskSearchStrategy);
    const results = await searchContext.executeSearch(query);

    setSearchResults(results);
    setShowDropdown(true);
  }

  function handleSelect(item) {
    setShowDropdown(false);
    setQuery(item.title);
    setTasks(extractSearchResults(allTasks, [item]));
  }

  return (
    <div className="tasks-container">
      <div className="task-search-input-wrapper">
        <TextField
          className="myCustomTextField"
          inputRef={anchorRef}
          value={query}
          onChange={handleSearch}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onFocus={() => {
            if (searchResults.length) setShowDropdown(true);
          }}
          type="text"
          name={searchType}
          placeholder={`Enter task title...`}
          fullWidth
          variant="outlined"
          size="small"
        />
        <Popper
          open={showDropdown && searchResults.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{
            zIndex: 1300,
            width: anchorRef.current?.offsetWidth,
          }}
        >
          <Paper elevation={3}>
            <List dense style={{ maxHeight: 240, overflowY: "auto" }}>
              {searchResults.map((item) => (
                <ListItem
                  key={item.id}
                  disablePadding
                  onMouseDown={() => handleSelect(item)}
                  sx={{
                    borderBottom: "0.2px solid black",
                  }}
                >
                  <ListItemButton>
                    <ListItemText primary={item.title || item.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popper>
      </div>
      <div className="tasks-list-container">
        {tasks.map((task, index) => {
          const statusColor =
            task.status === "Completed"
              ? "#16a34a"
              : task.status === "In Progress"
              ? "#f59e0b"
              : "#64748b";

          return (
            <Paper
              key={index}
              elevation={1}
              sx={{
                backgroundColor: "#122333",
                color: "#ffffff",
                borderRadius: 2,
                padding: 2,
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
                },
              }}
            >
              {/* Left: Title */}
              <Link
                to={`/task-manager/${task["id"]}`}
                state={{ task }}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={task.title}
              >
                {task["title"]}
              </Link>

              {/* Right: Status & Assignee */}
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "#e2e8f0", // light gray text
                  flexWrap: "wrap", // wraps nicely on small screens
                }}
              >
                {/* Status */}
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      backgroundColor:
                        task.status === "Completed"
                          ? "#16a34a"
                          : task.status === "In Progress"
                          ? "#f59e0b"
                          : "#64748b",
                      color: "#fff",
                      px: 1.5,
                      py: 0.3,
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {task.status || "Unknown"}
                  </Box>
                </Box>

                {/* Assignee */}
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    Assignee:
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      color: "#60a5fa",
                      fontWeight: 500,
                    }}
                  >
                    {task.assignee?.firstName} {task.assignee?.lastName || ""}
                  </Box>
                </Box>
              </Typography>
            </Paper>
          );
        })}
      </div>
    </div>
  );
}

export default Tasks;
