import { getToken } from "../user/actions/token";
import { BASE_URL } from "./endpoints";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

class ApiMethods {
  static async apiRequest(method, endpoint, body) {
    const url = BASE_URL + endpoint;

    const options = {
      method,
      headers: getHeaders(),
    };

    if (body && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (res.status === 204) {
      return null;
    }

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.detail || data.message || res.statusText);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  static get(url) {
    return this.apiRequest("GET", url);
  }

  static post(url, data) {
    return this.apiRequest("POST", url, data);
  }

  static put(url, data) {
    return this.apiRequest("PUT", url, data);
  }

  static patch(url, data) {
    return this.apiRequest("PATCH", url, data);
  }

  static delete(url) {
    return this.apiRequest("DELETE", url);
  }
}

export default ApiMethods;
