import ApiManager from "../../api-client/api-manager";

export async function signOut() {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    await ApiManager.logout({ refresh: refreshToken });
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
