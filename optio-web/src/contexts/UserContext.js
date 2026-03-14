import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import { signOut } from "../user/actions/signOut";
import ApiManager from "../api-client/api-manager";

export const UserContext = createContext();

export function useUser() {
  const ctx = useContext(UserContext);
  return ctx;
}

function getUserFromStorage() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    if (!user) return null;

    const orgsRaw = localStorage.getItem("organizations");
    const organizations = orgsRaw ? JSON.parse(orgsRaw) : [];
    const currentOrganizationId = localStorage.getItem("currentOrganizationId");

    return { ...user, organizations, currentOrganizationId };
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  async function login(email, password) {
    const res = await ApiManager.login({ email: email, password: password });

    const { access, refresh, user, organizations } = res;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("organizations", JSON.stringify(organizations));

    const currentOrg = organizations[0]?.organizationId;
    localStorage.setItem("currentOrganizationId", currentOrg);

    setUser({
      ...user,
      organizations,
      currentOrganizationId: currentOrg,
    });
    console.log("User", user);

    return { ok: true };
  }

  async function logout() {
    await signOut();
    setUser(null);
  }

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
