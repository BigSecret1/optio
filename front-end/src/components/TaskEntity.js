import { isAuthenticated } from '../utils/auth';

class Task {
    baseUrl = "http://localhost:8000/tasks";

    constructor(
        title = '',
        projectId = null,
        id = null,
        subtasks = [],
        dueDate = '',
        comments = [],
        description = '',
        taskStatus = ''
    ) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.subtasks = subtasks;
        this.comments = comments;
        this.dueDate = dueDate;
        this.description = description;
        this.taskStatus = taskStatus;
    }

    async updateTask(params = {}) {
        // Authentication is required
        const loggedIn = isAuthenticated();
        if (!loggedIn) {
            window.location.href = '/login';
            return;
        }
        const accessToken = localStorage.getItem("access_token");

        const requestBody = Object.fromEntries(
            Object.entries(params).filter(([key, value]) => value != undefined)
        );
        console.log("UPDATES IN TASK ARE :", requestBody);

        if (!requestBody['id']) {
            console.log("TASK ID IS MISSING CANNOT UPDATE THE TASK");
            return;
        }
        const updateEndpoint = `/update-task/${requestBody['id']}/`


        try {
            const response = await fetch(`${this.baseUrl}${updateEndpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                console.log("TASK WAS UPDATED SUCCESSFULLY");
                const updatedTask = await response.json();
                console.log("new comments ",updatedTask["comments"]);
                return updatedTask;
            }
            else {
                console.log("FAILED TO UPDATE THE TASK:", response.statusText);
            }
        } catch (error) {
            console.log("ERROR DURING THE TASK UPDATE :", error);
        }
    }
}

export default Task;
