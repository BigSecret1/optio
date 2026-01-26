import { SERVER_HOST } from "../../constants";

const logout_url = `${SERVER_HOST}/users/logout/`;

export async function signOut() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const requestBody = { refresh: refreshToken };

  try {
    const response = await fetch(logout_url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 205) {
      console.log("Logout successful!");
    } else {
      console.error(
        `Logout failed: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    clearAuthStorage();
  }
}

function clearAuthStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}
