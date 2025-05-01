import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/Dashboard";
import Auth from "./components/auth/Auth";
import ListUsers from "./components/auth/ListUsers";
import Projects from "./components/Projects";
import Tasks from "./components/tasks/Tasks";
import TaskManager from "./components/TaskManager";
import NewTask from "./components/task/NewTask";
import Profile from "./components/profile/Profile";
import Note from "./components/quicknotes/Note";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <h1>moving you to login page ...</h1>;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

document.title = "OpTio";

root.render(
  <React.StrictMode>
    <App />

    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />

        <Route
          path="/users/list"
          element={
            <PrivateRoute>
              <ListUsers />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks columns={["Task", "Project", "Status"]} />
            </PrivateRoute>
          }
        />

        <Route
          path="/new/task"
          element={
            <PrivateRoute>
              <NewTask />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/quicknote"
          element={
            <PrivateRoute>
              <Note />
            </PrivateRoute>
          }
        />

        <Route path="/task-manager/:task_id" element={<TaskManager />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals(console.log);
