import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Task from "./task-service";
import ShowTask from "./ShowTask";
import Navbar from "./Navbar";
import { StateProvider } from "./TaskStateProvider";



function TaskManager() {
    const location = useLocation();
    const { task } = location.state;
    const taskInstace = new Task(
        task.title,
        task.project_id,
        task.id,
        task.subtasks,
        task.due_date,
        task.comments,
        task.description,
        task.task_status
    );

    return (
        <>
            <StateProvider>
                <Navbar />
                <ShowTask taskId={taskInstace.id} />
            </StateProvider>
        </>
    );
}

export default TaskManager;
