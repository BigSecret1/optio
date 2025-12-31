import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  TextField,
  Popper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import "./Projects.css";
import ProjectAction from "../project/index";
import { searchContext, projectSearchStrategy } from "../search/index";
import { extractSearchResults } from "../util";

export default function Projects() {
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
    <Box sx={{ p: 3 }}>
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

      <Stack spacing={2} sx={{ mt: 8 }}>
        {projects.map((project) => (
          <Card
            key={project.id}
            component={Link}
            to={`/projects/${project.id}/overview`}
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "all 0.2s ease",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <CardContent>
              <Typography
                component={Link}
                to={`/projects/${project.id}/tasks`}
                variant="h6"
                fontWeight={700}
                sx={{
                  color: (theme) => theme.palette.primary.contrastText,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: (theme) => theme.palette.primary.light,
                  },
                }}
              >
                {project.name}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  mb: 1.5,
                  color: (theme) => theme.palette.primary.contrastText,
                }}
              >
                {project.description}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: (theme) => theme.palette.grey[400],
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                }}
              >
                Modified: some_time
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
