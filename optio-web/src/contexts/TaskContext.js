import React, { createContext, useState, useEffect } from "react";

import ApiManager from "../api-client/api-manager";

/**
 * TaskContext provides the necessary states and functions for managing tasks.
 * It enables reuse of stateful logic across all components within `ShowTask.js`,
 * ensuring consistent data and actions throughout the task-related components.
 */
export const TaskContext = createContext();

export function TaskProvider({ taskId, children }) {
  const [task, setTask] = useState(null);
  const [subTasks, setSubTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWaitingForSubTasks, setIsWaitingForSubTasks] = useState(true);
  const [isEditingTaskHeader, setIsEditingTaskHeader] = useState(false);
  const [isEditingTaskStatus, setIsEditingTaskStatus] = useState(false);
  const [isEditingTaskDescription, setIsEditingTaskDescription] =
    useState(false);

  const optionToState = new Map();

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId]);

  async function fetchTask(id) {
    try {
      const result = await ApiManager.getTask(id);
      setTask(result);
    } catch (error) {
      console.error("Failed to fetch task", error);
    } finally {
      setLoading(false);
    }
  }

  async function getUpdatedTask(id) {
    try {
      const currentTask = await ApiManager.getTask(id);

      if (currentTask.comments == null) {
        currentTask.comments = [];
      } else {
        currentTask.comments.reverse();
      }

      setTask(currentTask);
    } catch (error) {
      console.error("Failed to get updated task", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTask(id, params) {
    try {
      await ApiManager.updateTask(id, params);
      await getUpdatedTask(id);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  }

  async function refreshSubTasks(parentTaskId) {
    try {
      const parentTask = await ApiManager.getTask(parentTaskId);
      setSubTasks(parentTask.subTasks || []);
    } catch (error) {
      console.error("Failed to fetch subtasks", error);
    } finally {
      setIsWaitingForSubTasks(false);
    }
  }

  return (
    <TaskContext.Provider
      value={{
        task,
        setTask,
        loading,
        setLoading,
        isWaitingForSubTasks,
        isEditingTaskHeader,
        setIsEditingTaskHeader,
        isEditingTaskStatus,
        setIsEditingTaskStatus,
        isEditingTaskDescription,
        setIsEditingTaskDescription,
        subTasks,
        optionToState,
        getUpdatedTask,
        updateTask,
        refreshSubTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
