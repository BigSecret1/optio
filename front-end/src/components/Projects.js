import React, { useState, useEffect } from 'react'
import './Projects.css'; // Create a CSS file for styling

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    // Fetch projects from the backend using Fetch API
    fetch('http://localhost:8000/projects/list/', {
        method: 'GET',
        headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`, 
        },
    })
      .then(response => response.json())
      .then(data => {
        console.log(`RECEIVED PROJECT DATA IS : ${JSON.stringify(data)}`);
        setProjects(data);
      })
      .catch(error => {
        console.error('There was an error fetching the projects!', error);
      });
  }, []);

  // Helper function to convert UTC to local time in "yy:dd:mm:H:M" format
  const convertToLocalTime = (utcDateStr) => {
    console.log("RECEIVED UTC TIME :", utcDateStr);
    const utcDate = new Date(utcDateStr);
    const localDay = utcDate.getDate();
    const localMonth = utcDate.getMonth() + 1; // Months are zero-based
    const localYear = utcDate.getFullYear().toString(); // Get last two digits of the year
    const localHours = utcDate.getHours(); // Local hours
    const localMinutes = utcDate.getMinutes(); // Local minutes

    // Format the date and time components
    const formattedDay = localDay.toString().padStart(2, '0');
    const formattedMonth = localMonth.toString().padStart(2, '0');
    const formattedYear = localYear.toString().padStart(4, '0');
    const formattedHours = localHours.toString().padStart(2, '0');
    const formattedMinutes = localMinutes.toString().padStart(2, '0');

    const localTime = `${formattedYear}-${formattedDay}-${formattedMonth}${' '}${formattedHours}:${formattedMinutes}`;
    console.log("CONVERTED TIME :", localTime)
    return localTime
  };

  return (
    <div className="projects-container">
      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <h3 className="project-name">{project.name}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-info">
            <span className="project-stars">⭐  Starred</span>
            <span className="project-updated">
              Modified : {convertToLocalTime(project.last_updated)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;
