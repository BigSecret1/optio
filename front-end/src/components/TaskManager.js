import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Task from "./TaskEntity";

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
    const { task_id } = useParams();

    return (
        <h1>
            This is task manager with id {task_id} and title {taskInstace.title}}
        </h1>
    );
}

export default TaskManager;
