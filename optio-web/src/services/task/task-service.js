import { isAuthenticated } from "../../utils/auth";
import { SERVER_HOST } from "../../constants";

// These status values are case sensitive sp Changing them can break the functionality.
export const ALL_STATUS = ["To Do", "In Progress", "Completed"];
const BASE_URL = SERVER_HOST + "/tasks";

class Task {
  constructor(
    title = "",
    projectId = null,
    id = null,
    subtasks = [],
    dueDate = "",
    comments = [],
    description = "",
    taskStatus = ""
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

  async create(data = {}) {
    const endpoint = "/create-task/";
    const url = `${BASE_URL}${endpoint}`;
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async getTasks(params = {}) {
    const loggedIn = isAuthenticated();
    if (!loggedIn) {
      return;
    }

    // const projectId = params["projectId"];
    const projectId = 2; // need to remove
    const endpoint = `/get-tasks/?project_id=${projectId}`;
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const tasks = await response.json();
      return tasks;
    } catch (err) {
      console.error("Failed to fetch tasks ", err);
    }
  }

  async getTask(taskId) {
    const loggedIn = isAuthenticated();
    if (!loggedIn) {
      return;
    }
    const accessToken = localStorage.getItem("accessToken");

    const endpoint = `/get-task-by-id/${taskId}`;

    try {
      console.log(
        `Fetching task with ${taskId} requesting to ${BASE_URL}${endpoint}`
      );
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const task = await response.json();
      if (response.ok) {
        console.log(`Suceessfully fetched task with id ${taskId}`);
        console.log("Task : ", task);
        return task;
      } else {
        console.log("COULDN'T FETCH TASK");
      }
    } catch (error) {
      console.error("An error occured while fetching the task : ", error);
    }
  }

  async updateTask(params = {}) {
    const loggedIn = isAuthenticated();
    if (!loggedIn) {
      return;
    }
    const accessToken = localStorage.getItem("accessToken");

    const requestBody = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value != undefined)
    );
    if (!requestBody["id"]) {
      return;
    }
    const updateEndpoint = `/update-task/${requestBody["id"]}/`;

    try {
      const response = await fetch(`${BASE_URL}${updateEndpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });
      const updatedTask = await response.json();

      if (response.ok) {
        console.info("Task was updated successfully");
        return updatedTask;
      } else {
        console.error("FAILED TO UPDATE THE TASK:", response.statusText);
      }
    } catch (error) {
      console.log("Task update failed error ", error);
    }
  }
}

export default Task;
