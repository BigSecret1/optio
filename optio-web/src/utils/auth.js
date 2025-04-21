const base_url = "http://localhost:8000";

const login_url = `${base_url}/users/login/`;
const logout_url = `${base_url}/users/logout/`;

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
    const response = await fetch(login_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log("Login successful!");

      const accessToken = data.access;
      const refreshToken = data.refresh;
      return { accessToken, refreshToken };
    } else {
      console.error(
        `Login failed: ${response.status} - ${response.statusText}`
      );
      return { accessToken: null, refreshToken: null };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { accessToken: null, refreshToken: null };
  }
}
