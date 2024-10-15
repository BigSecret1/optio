import React, { createContext, useState } from 'react';
import Task from './task-service';


export const StateContext = createContext();

export function StateProvider({ children }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editTaskTitle, setEditTaskTitle] = useState(true);

    const taskService = new Task();

    // Function to fetch task
    async function getTask(taskId) {
        const currentTask = await taskService.getTask(taskId);
        console.log("CURRENT TASK ", currentTask);

        // For latest comment to come on top
        if (currentTask.comments == null) {
            currentTask.comments = [];
        }
        else {
            currentTask.comments.reverse();
        }
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
