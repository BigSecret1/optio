import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Tasks from "./Tasks";
import ApiManager from "../../api-client/api-manager";

function ProjectTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const result = await ApiManager.getTasksByProject(projectId);
        setTasks(result);
      } catch (error) {
        console.error("Failed to fetch project tasks", error);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  if (loading) return <p>Loading ...</p>;

  return <Tasks tasks={tasks} />;
}

export default ProjectTasks;
