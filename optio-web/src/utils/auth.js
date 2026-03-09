import { SERVER_HOST } from "../constants";

const base_url = SERVER_HOST;

const loginUrl = `${base_url}/api/security/login/`;

export function isAuthenticated() {
  let loggedIn = localStorage.getItem("accessToken");
  if (loggedIn) {
    return true;
  } else {
    window.location.href = "/login";
    return false;
  }
}
