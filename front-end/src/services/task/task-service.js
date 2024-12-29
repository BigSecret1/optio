import { Class } from "@mui/icons-material";
import { isAuthenticated } from "../../utils/auth";

/**
 * These status values are case sensitive sp Changing them can break the functionality.
 * For example in edit task status option to change task status
 */
export const ALL_STATUS = ["Completed", "In Progress", "To Do"];

const BASE_URL = "http://localhost:8000/tasks";

class Task {
  sanitize = new Sanitize();

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

  async getTasks(params = {}) {
    const loggedIn = isAuthenticated();
    if (!loggedIn) {
      return;
    }

    const projectId = params["projectId"];
    const endpoint = `/get-tasks/?project_id=${projectId}`;
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const tasks = await response.json();
      console.log("FETCHED TASKS ARE ", tasks);
      // return this.sanitize.sanitizeTaskData(tasks);  // this needs a fix , throwing error
      return tasks;
    } catch (err) {
      console.error("SOME ERROR OCCURED WHILE FETCHING PROJECT TASKS: ", err);
    }
  }

  async getTask(taskId) {
    const loggedIn = isAuthenticated();
    if (!loggedIn) {
      return;
    }
    const accessToken = localStorage.getItem("access_token");

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

    // Check if user is autherized
    if (!loggedIn) {
      return;
    }

    const accessToken = localStorage.getItem("access_token");

    // Filter out undefined values from params
    const requestBody = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value != undefined)
    );

    console.log("UPDATES IN TASK ARE :", requestBody);

    //Ensure task ID is resent before proceeding
    if (!requestBody["id"]) {
      console.log("TASK ID IS MISSING CANNOT UPDATE THE TASK");
      return;
    }

    const updateEndpoint = `/update-task/${requestBody["id"]}/`;

    try {
      // Send update request
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
        return this.sanitize.sanitizeTaskData(updatedTask);
      } else {
        console.error("FAILED TO UPDATE THE TASK:", response.statusText);
      }
    } catch (error) {
      console.log("ERROR DURING THE TASK UPDATE :", error);
    }
  }

  async search(searchTexts = {}) {
    const loggedIn = isAuthenticated();
    if (!loggedIn) {
      return;
    }
    const accessToken = localStorage.getItem("access_token");

    const taskTitle = searchTexts["task"];
    const projectName = searchTexts["project"];
    const taskStatus = searchTexts["status"];

    const endpoint = `/search/?title=${taskTitle}&status=${taskStatus}&project=${projectName}`;
    const url = `${BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const tasks = await response.json();
      console.log("search texts are ", searchTexts);
      console.log("founded tasks ", tasks);
      return tasks;
    } catch (error) {
      console.log("An error occured while searching for task ", error);
    }
  }
}

class Sanitize {
  defaultProperties = {
    comments: [],
    subtasks: [],
    title: "Untitled",
    due_date: null,
    description: "",
    task_status: "Pending",
    created_time: new Date().toISOString(), // Default to current time as ISO string
    project_id: null,
  };

  // Data santization is required to ensure task data is in required model
  sanitizeTaskData(task) {
    return Object.keys(task).reduce((sanitizedTask, key) => {
      sanitizedTask[key] = this.sanitizeValue(task[key], key);
      return sanitizedTask;
    }, {});
  }

  sanitizeValue(value, key) {
    return value ?? this.defaultProperties[key] ?? "N/A"; // Fallback to default
  }
}

export default Task;
