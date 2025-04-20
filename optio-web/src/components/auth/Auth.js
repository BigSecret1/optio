import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/auth.css";
import { login } from "../../utils/auth";

function Auth() {
  const navigate = useNavigate();

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

  async function handleSignIn(e) {
    e.preventDefault();
    const { access_token, refresh_token } = await login(
      userData.username,
      userData.password
    );
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      navigate("/dashboard");
    } else {
      // handle error
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignIn}>
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
