import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import "./App.css";

import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/Dashboard";
import Auth from "./components/auth/Auth";
import ListUsers from "./components/auth/ListUsers";
import EditUser from "./components/auth/EditUser";
import Projects from "./components/Projects";
import Tasks from "./components/tasks/Tasks";
import ProjectTasks from "./components/tasks/ProjectTasks";
import TaskManager from "./components/TaskManager";
import NewTask from "./components/task/NewTask";
import Profile from "./components/profile/Profile";
import Note from "./components/quicknotes/Note";
import Create from "./components/common/Create";
import NewProject from "./components/project/NewProject";
import CreateUser from "./components/auth/CreateUser";

import { NewProvider } from "./contexts/NewContext";

// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("accessToken");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <NewProvider>
      <Create />
      <NewProject />
      <NewTask />

      <Routes>
        <Route
          path="/users/create"
          element={
            <PrivateRoute>
              <CreateUser />
            </PrivateRoute>
          }
        />
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
          path="/user/edit/:id"
          element={
            <PrivateRoute>
              <EditUser />
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
          path="/projects/list"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects/:projectId/tasks"
          element={
            <PrivateRoute>
              <ProjectTasks />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
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
    </NewProvider>
  );
}

export default App;
