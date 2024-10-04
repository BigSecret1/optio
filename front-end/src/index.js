import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// import bootstrap for the project
import "bootstrap/dist/css/bootstrap.min.css";

// import custom components
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import FormDialog from "./components/EditTask";
import TaskManager from "./components/TaskManager";

const root = ReactDOM.createRoot(document.getElementById("root"));
const PrivateRoute = ({ children }) => {
  // Authentication check before component is rendered
  const isAuthenticated = localStorage.getItem("access_token");
  return isAuthenticated ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

document.title = "ToDOler";

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />

        <Route
          path="/test"
          element={
            <PrivateRoute>
              <FormDialog />
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
              <Tasks columns={["Project", "Task", "Status"]} />
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
