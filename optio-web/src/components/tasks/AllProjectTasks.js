import React, { useEffect, useState } from "react";

import Tasks from "./Tasks";
import ApiManager from "../../api-client/api-manager";

export default function AllProjectTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllTasks() {
      try {
        const projects = await ApiManager.getProjects();
        const taskPromises = projects.map((p) =>
          ApiManager.getTasksByProject(p.id).catch(() => []),
        );
        const taskArrays = await Promise.all(taskPromises);
        setTasks(taskArrays.flat());
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllTasks();
  }, []);

  if (loading) return <p>Loading ...</p>;

  return <Tasks tasks={tasks} />;
}
