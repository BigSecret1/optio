import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Projects.css";
import ProjectAction from "../project/action";

function Projects() {
  const projectAction = new ProjectAction();
  const [projects, setProjects] = useState([]);

  async function fetchProjects() {
    const data = await projectAction.fetchAll();
    setProjects(data);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // Helper function to convert UTC to local time in "yy:dd:mm:H:M" format
  function convertToLocalTime(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const localDay = utcDate.getDate();
    const localMonth = utcDate.getMonth() + 1; // Months are zero-based
    const localYear = utcDate.getFullYear().toString(); // Get last two digits of the year
    const localHours = utcDate.getHours(); // Local hours
    const localMinutes = utcDate.getMinutes(); // Local minutes

    // Format the date and time components
    const formattedDay = localDay.toString().padStart(2, "0");
    const formattedMonth = localMonth.toString().padStart(2, "0");
    const formattedYear = localYear.toString().padStart(4, "0");
    const formattedHours = localHours.toString().padStart(2, "0");
    const formattedMinutes = localMinutes.toString().padStart(2, "0");

    const localTime = `${formattedYear}-${formattedDay}-${formattedMonth}${" "}${formattedHours}:${formattedMinutes}`;
    console.log("CONVERTED TIME :", localTime);
    return localTime;
  }

  return (
    <div className="projects-container">
      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <h3 className="project-name">
            <Link to={`/projects/${project.id}/tasks`}>{project.name}</Link>
          </h3>
          <p className="project-description">{project.description}</p>
          <div className="project-info">
            <span className="project-updated">
              Modified : {convertToLocalTime(project.last_updated)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Projects;
