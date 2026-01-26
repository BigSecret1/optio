import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import { login as authLogin } from "../utils/auth";
import { signOut } from "../user/actions/signOut";

export const UserContext = createContext();

/** Hook to access the current user and auth actions from any component. */
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}

/**
 * Hydrates user from localStorage when a valid session (accessToken) exists.
 * Keeps localStorage and context in sync on init and after login/logout.
 */
function getUserFromStorage() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const login = useCallback(async (email, password) => {
    const { accessToken, refreshToken, user: userData } = await authLogin(
      email,
      password
    );
    if (!accessToken) return { ok: false };
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
