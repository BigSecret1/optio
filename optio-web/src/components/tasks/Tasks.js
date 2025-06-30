// import React, { useEffect, useState, useRef } from "react";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// import { Modal, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";

// import TextField from "@mui/material/TextField";
// import Popper from "@mui/material/Popper";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemText from "@mui/material/ListItemText";
// import Paper from "@mui/material/Paper";

// import Task from "../../services/task/task-service";
// import "../../styles/Tasks.css";
// import { searchContext, taskSearchStrategy } from "../../search/index";

// function Tasks({ projectTasks = [] }) {
//   const searchOptions = ["Task", "Status", "Assignee"];
//   const task = new Task();
//   const [tasks, setTasks] = useState([]);
//   const hasSetProjectTasks = useRef(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);

//   const anchorRef = useRef(null);

//   useEffect(() => {
//     async function fetchTasks() {
//       const allTasks = await task.getTasks();
//       setTasks(allTasks);
//     }

//     if (projectTasks.length && !hasSetProjectTasks.current) {
//       setTasks(projectTasks);
//       hasSetProjectTasks.current = true;
//     } else if (projectTasks.length == 0 && !hasSetProjectTasks.current) {
//       fetchTasks();
//     }
//   }, []);

//   async function search(type, input) {
//     if (type.toLowerCase() === "task") {
//       console.log("Input to search is ", input);
//       const query = {
//         title: input,
//       };
//       searchContext.setStrategy(taskSearchStrategy);
//       const results = await searchContext.executeSearch(query);
//       setSearchResults(results);
//       setShowDropdown(true);
//       console.log("Tasks found are : ", results);
//       for (let i = 0; i < results.length; ++i) {
//         console.log("match : ", results[i].title);
//       }
//     }
//   }

//   function handleSearch(event) {
//     console.log("Calling search", event.target.value, event.target.name);
//     search(event.target.name, event.target.value);
//   }

//   function handleSelect(item) {
//     console.log("Route to task ", item);
//   }

//   return (
//     <div className="resizable-layout-container">
//       <div style={{ position: "relative" }}>
//         <TextField
//           inputRef={anchorRef}
//           onChange={handleSearch}
//           onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//           onFocus={() => {
//             if (searchResults.length) setShowDropdown(true);
//           }}
//           type="text"
//           name="task"
//           placeholder={`Enter task details...`}
//           fullWidth
//           variant="outlined"
//           size="small"
//         />
//         <Popper
//           open={showDropdown && searchResults.length > 0}
//           anchorEl={anchorRef.current}
//           placement="bottom-start"
//           style={{
//             zIndex: 1300,
//             width: anchorRef.current?.offsetWidth,
//           }}
//         >
//           <Paper elevation={3}>
//             <List dense style={{ maxHeight: 240, overflowY: "auto" }}>
//               {searchResults.map((item) => (
//                 <ListItem
//                   key={item.id}
//                   disablePadding
//                   onMouseDown={() => handleSelect(item)}
//                   sx={{
//                     borderBottom: "1px solid #eee",
//                   }}
//                 >
//                   <ListItemButton>
//                     <ListItemText primary={item.title || item.name} />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>
//         </Popper>
//       </div>

//       <br></br>

//       <div className="dialogue-box">
//         {tasks.map((task, index) => (
//           <div
//             key={index}
//             className="task-item"
//             style={{ backgroundColor: "#304971", marginBottom: "20px" }}
//           >
//             <p>
//               <Link to={`/task-manager/${task["id"]}`} state={{ task }}>
//                 {task["title"]}
//               </Link>
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Tasks;

import React, { useEffect, useState, useRef } from "react";
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
import { Link } from "react-router-dom";
import Task from "../../services/task/task-service";
import "../../styles/Tasks.css";
import { searchContext, taskSearchStrategy } from "../../search/index";

function Tasks({ projectTasks = [] }) {
  const searchOptions = ["Task", "Assignee"];
  const [searchType, setSearchType] = useState("Task");
  const task = new Task();
  const [tasks, setTasks] = useState([]);
  const hasSetProjectTasks = useRef(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  const anchorRef = useRef(null);

  useEffect(() => {
    async function fetchTasks() {
      const allTasks = await task.getTasks();
      setTasks(allTasks);
    }

    if (projectTasks.length && !hasSetProjectTasks.current) {
      setTasks(projectTasks);
      hasSetProjectTasks.current = true;
    } else if (projectTasks.length === 0 && !hasSetProjectTasks.current) {
      fetchTasks();
    }
  }, []);

  async function search(type, input) {
    if (type.toLowerCase() === "task") {
      const query = { title: input };
      searchContext.setStrategy(taskSearchStrategy);
      const results = await searchContext.executeSearch(query);
      setSearchResults(results);
      setShowDropdown(true);
    }
    // Add logic for "Status" or "Assignee" as needed
    else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }

  function handleSearch(event) {
    setQuery(event.target.value);
    search(searchType, event.target.value);
  }

  function handleSelect(item) {
    setShowDropdown(false);
    setQuery(item.title || item.name);
    // You can add navigation or detail showing here
  }

  function handleTypeChange(event) {
    setSearchType(event.target.value);
    setQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  }

  return (
    <div className="resizable-layout-container">
      <div className="search-row">
        <FormControl size="small" className="search-type-select">
          <InputLabel id="search-type-label">Search by</InputLabel>
          <Select
            labelId="search-type-label"
            value={searchType}
            label="Search by"
            onChange={handleTypeChange}
          >
            {searchOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="search-input-wrapper">
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
            placeholder={`Enter ${searchType.toLowerCase()} details...`}
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
      </div>

      <br />

      <div className="dialogue-box">
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
