import { getToken } from "../user/actions/token";
import { BASE_URL } from "./endpoints";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

class ApiMethods {
  static apiRequest(method, endpoint, body = {}) {
    const url = BASE_URL + endpoint;
    return new Promise((resolve, reject) => {
      fetch(url, { method, body: JSON.stringify(body), headers: getHeaders() })
        .then((res) => res.json())
        .then(resolve)
        .catch(reject);
    });
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
