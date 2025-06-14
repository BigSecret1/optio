import { isAuthenticated } from "../../utils/auth";

export function getToken() {
    const loggedIn = isAuthenticated();
    if(!loggedIn) return null;
    const accessToken = localStorage.getItem("accessToken");
    return accessToken;
}
