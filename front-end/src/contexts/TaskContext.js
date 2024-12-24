import React, { createContext, useState } from 'react';
import Task from '../services/task/task-service';



/** 
    * TaskContext provides the necessary states and functions for managing tasks.
    * It enables reuse of stateful logic across all components within `ShowTask.js`,
    * ensuring consistent data and actions throughout the task-related components.
 */
export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editTaskTitle, setEditTaskTitle] = useState(false);
    const [open, setOpen] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [isEditingTaskStatus, setIsEditingTaskStatus] = useState(false);
    const [isEditingTaskTitle, setIsEditingTaskTitle] = useState(false);

    const taskService = new Task();

    const optionToState = new Map()

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
            console.log("task with latest details ", currentTask);

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
        <TaskContext.Provider value={{
            task, setTask,
            loading, setLoading,
            isEditingTaskTitle, setIsEditingTaskTitle,
            open, setOpen,
            changeStatus, setChangeStatus,
            isEditingTaskStatus, setIsEditingTaskStatus,
            taskService,
            optionToState,
            getUpdatedTask
        }}>
            {children}
        </TaskContext.Provider>
    );
}
