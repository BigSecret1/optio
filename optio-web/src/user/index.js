import { SERVER_HOST } from "../constants";
import { getToken } from "../user/actions/token";

export class User {
  constructor() {
    this.accessToken = getToken();
    this.baseUrl = SERVER_HOST;
  }

  async listUsers(id = null) {
    const endPoint = id ? `/users/list/${id}` : "/users/list/";
    const url = this.baseUrl + endPoint;

    try {
      console.log("Sending request to backend with url:", endPoint);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Failed to fetch users: ${error.detail || response.statusText}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("Failed to fetch users list with an error:", err);
      throw err;
    }
  }

  async updateUser(id, firstName, lastName, groups = []) {
    const url = `${this.baseUrl}/users/edit/${id}/`;
    const payload = { firstName, lastName, groups };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Failed to update user: ${error.detail || response.statusText}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  }

  async deleteUser(id) {
    const url = `${this.baseUrl}/users/delete/${id}/`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }

      const data = await response.json();
      console.log("User deleted:", data);
      return data;
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw error;
    }
  }
}
