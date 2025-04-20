class ProjectAction {
  async fetchAll() {
    const url = "http://127.0.0.1:8000/projects/list";
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
