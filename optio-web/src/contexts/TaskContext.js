import React, { createContext, useState } from "react";

import Task from "../services/task/task-service";
import SubTasksOperation from "../services/task/sub-task-operations";

/**
 * TaskContext provides the necessary states and functions for managing tasks.
 * It enables reuse of stateful logic across all components within `ShowTask.js`,
 * ensuring consistent data and actions throughout the task-related components.
 */
export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [task, setTask] = useState(null);
  const [subTasks, setSubTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWaitingForSubTasks, setIsWaitingForSubTasks] = useState(true);
  const [isEditingTaskTitle, setIsEditingTaskTitle] = useState(false);
  const [isEditingTaskStatus, setIsEditingTaskStatus] = useState(false);
  const [isEditingTaskDescription, setIsEditingTaskDescription] =
    useState(false);

  const taskService = new Task();
  const subTasksOperation = new SubTasksOperation();

  /**
   * For each selected option in option menu of different sections(header, description etc.)
   * a mapping is needed with there respective state which is responsible for rednering
   * editing components.
   * for e.g. ("Edit title" : setIsEditingTaskTitle)
   */
  const optionToState = new Map();

  /**
   * This function is used to get task with latest changees.
   * This is helper functino specially in those cases when there is any
   * change made for a task and those
   * latest changes should be reflected.
   * The function call ensure to fetch tasks and updated task state (setTask) with reponse.
   */
  async function getUpdatedTask(taskId) {
    try {
      const currentTask = await taskService.getTask(taskId);

      // latest comment should be on the top[shift this logic in backend asap: update query]
      if (currentTask.comments == null) {
        currentTask.comments = [];
      } else {
        currentTask.comments.reverse();
      }

      setTask(currentTask);
    } catch (error) {
      console.error("Failed to get updated task, an error occured", error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSubTasks(taskId) {
    try {
      const latestSubTasks = await subTasksOperation.getSubTasks(taskId);
      setSubTasks(latestSubTasks);
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
        isEditingTaskTitle,
        setIsEditingTaskTitle,
        isEditingTaskStatus,
        setIsEditingTaskStatus,
        isEditingTaskDescription,
        setIsEditingTaskDescription,
        subTasks,
        taskService,
        subTasksOperation,
        optionToState,
        getUpdatedTask,
        refreshSubTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
