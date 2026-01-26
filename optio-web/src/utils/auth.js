import { SERVER_HOST } from "../constants";

const base_url = SERVER_HOST;

const loginUrl = `${base_url}/users/login/`;

export function isAuthenticated() {
  let loggedIn = localStorage.getItem("accessToken");
  if (loggedIn) {
    return true;
  } else {
    window.location.href = "/login";
    return false;
  }
}

export async function login(email, password) {
  const credentials = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.status === 200) {
      const data = await response.json();
      const accessToken = data.access;
      const refreshToken = data.refresh;
      const user = data.user;

      return { accessToken, refreshToken, user };
    } else {
      console.error(
        `Login failed: ${response.status} - ${response.statusText}`
      );
      return { accessToken: null, refreshToken: null };
    }
  } catch (error) {
    return { accessToken: null, refreshToken: null };
  }
}
