import React, { useState, useEffect } from 'react';
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
             'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
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

  return (
    <div className="projects-container">
      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <h3 className="project-name">{project.name}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-info">
            <span className="project-stars">⭐ {project.stars}</span>
            <span className="project-updated">Updated {new Date(project.project_updated).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;
