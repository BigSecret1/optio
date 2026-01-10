import { getToken } from "../user/actions/token";
import { BASE_URL } from "./endpoints";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

class ApiMethods {
  static apiRequest(method, endpoint, body) {
    const url = BASE_URL + endpoint;

    const options = {
      method,
      headers: getHeaders(),
    };

    // Sending empty body object in GET/HEAD request can throw an error, so prevention is required
    if (body && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    return fetch(url, options).then((res) => res.json());
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

  static delete(url) {
    return this.apiRequest("DELETE", url);
  }
}

export default ApiMethods;
