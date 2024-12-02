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
    const [editTaskTitle, setEditTaskTitle] = useState(false);
    const [open, setOpen] = useState(false);
    const [openChangeStatus, setOpenChangeStatus] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);

    const taskService = new Task();

    /*
        This function is used to get task with latest changees.
        This is helper functino specially in those cases when there is any change made for a task and those
        latest changes should be reflected.
        The function call ensure to fetch tasks and updated task state with reponse.
        
        @param {number} taskId - Id of the task
    */
    async function getUpdatedTask(taskId) {
        try {
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
        catch (error) {
            console.error("Failed to get updated task, an error occured", error);
        }
    }

    return (
        <StateContext.Provider value={{
            task, setTask,
            loading, setLoading,
            editTaskTitle, setEditTaskTitle,
            open, setOpen,
            openChangeStatus, setOpenChangeStatus,
            changeStatus, setChangeStatus,
            taskService,
            getUpdatedTask
        }}>
            {children}
        </StateContext.Provider>
    );
}
