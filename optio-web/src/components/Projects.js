import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";

import "./Projects.css";
import ProjectAction from "../project/action";
import { searchContext, projectSearchStrategy } from "../search/index";
import { extractSearchResults } from "../util";

function Projects() {
  const projectAction = new ProjectAction();

  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  const anchorRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const data = await projectAction.fetchAll();
    setProjects(data);
    setAllProjects(data);
  }

  function handleSearch(event) {
    const input = event.target.value;
    setQuery(input);

    if (input.trim() === "") {
      setProjects(allProjects);
      return;
    }

    search(input);
  }

  async function search(input) {
    const query = { name: input };
    searchContext.setStrategy(projectSearchStrategy);

    const results = await searchContext.executeSearch(query);

    setSearchResults(results);
    setShowDropdown(true);
  }

  function handleSelect(item) {
    setShowDropdown(false);
    setQuery(item.name);
    setProjects(extractSearchResults(allProjects, [item]));
  }

  return (
    <div className="projects-container">
      <div className="project-search-input-wrapper">
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
          name="projectSearch"
          placeholder="Enter project name..."
          fullWidth
          variant="outlined"
          size="small"
          autoComplete="off"
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
      <div className="project-list-container">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3 className="project-name">
              <Link to={`/projects/${project.id}/tasks`}>{project.name}</Link>
            </h3>
            <p className="project-description">{project.description}</p>
            <div className="project-info">
              <span className="project-updated">Modified : some_time</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
