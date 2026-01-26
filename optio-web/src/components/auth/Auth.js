import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/auth.css";
import { useUser } from "../../contexts/UserContext";

function Auth() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setShowPassword(checked);
    } else {
      setUserData({ ...userData, [name]: value });
    }
  }

  async function handleLogIn(e) {
    e.preventDefault();
    const { ok } = await login(userData.username, userData.password);
    if (ok) navigate("/dashboard");
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogIn}>
        <h2 className="auth-title">Welcome to Optio !</h2>

        <label>Username</label>
        <input
          type="text"
          name="username"
          required
          value={userData.username}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          value={userData.password}
          onChange={handleChange}
        />

        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="show-password"
            onChange={handleChange}
            checked={showPassword}
          />
          <label htmlFor="show-password">Show Password</label>
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Auth;
