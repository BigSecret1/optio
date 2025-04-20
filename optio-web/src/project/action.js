import { SERVER_HOST } from "../constants";

class ProjectAction {
  host = SERVER_HOST;

  async create(data = {}) {
    const endpoint = "/projects/create/";
    const url = this.host + endpoint;
    const accessToken = localStorage.getItem("access_token");

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
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async fetchAll() {
    const url = this.host + "/projects/list";
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const projects = await response.json();

      return projects;
    } catch (err) {
      console.error("Failed to fetch tasks ", err);
    }
  }
}

export default ProjectAction;
