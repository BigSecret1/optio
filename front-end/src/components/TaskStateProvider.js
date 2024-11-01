import React, { createContext, useState } from 'react';
import Task from './task-service';


export const StateContext = createContext();


/*
    * TaskStateContext provides the necessary states and functions for managing tasks.
    * It enables reuse of stateful logic across all components within `ShowTask.js`,
    ensuring consistent data and actions throughout the task-related components.
 */
export function StateProvider({ children }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editTaskTitle, setEditTaskTitle] = useState(true);

    const taskService = new Task();


    async function getTask(taskId) {
        const currentTask = await taskService.getTask(taskId);
        console.log("CURRENT TASK ", currentTask);

        // latest comment should be on the top
        if (currentTask.comments == null) {
            currentTask.comments = [];
        }
        else {
            currentTask.comments.reverse();
        }

        // Finish task page loading and make task appear
        setTask(currentTask);
        setLoading(false);
    }

    return (
        <StateContext.Provider value={{
            task, setTask,
            loading, setLoading,
            editTaskTitle, setEditTaskTitle,
            taskService,
            getTask
        }}>
            {children}
        </StateContext.Provider>
    );
}
