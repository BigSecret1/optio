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
    search(searchType, input);
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
        {tasks.map((task, index) => (
          <div
            key={index}
            className="task-item"
            style={{ backgroundColor: "#304971", marginBottom: "20px" }}
          >
            <p>
              <Link to={`/task-manager/${task["id"]}`} state={{ task }}>
                {task["title"]}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
