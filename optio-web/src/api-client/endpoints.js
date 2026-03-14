import { SERVER_HOST } from "../constants";

export const BASE_URL = SERVER_HOST + "/api";

export function getOrgId() {
  return localStorage.getItem("currentOrganizationId");
}

const ENDPOINTS = {
  // Auth
  LOGIN: "/security/login/",
  LOGOUT: "/security/logout/",
  TOKEN_REFRESH: "/token/refresh/",

  // Tasks
  TASKS: (orgId) => `/orgs/${orgId}/tasks/`,
  TASK: (orgId, taskId) => `/orgs/${orgId}/tasks/${taskId}/`,

  // Comments
  TASK_COMMENTS: (orgId, taskId) => `/orgs/${orgId}/tasks/${taskId}/comments/`,
  COMMENT: (orgId, commentId) => `/orgs/${orgId}/comments/${commentId}/`,

  // Projects
  PROJECTS: (orgId) => `/orgs/${orgId}/projects/`,
  PROJECT: (orgId, projectId) => `/orgs/${orgId}/projects/${projectId}/`,
  PROJECT_USERS: (orgId, projectId) => `/orgs/${orgId}/projects/${projectId}/users/`,

  // Users
  USERS: (orgId) => `/orgs/${orgId}/users/`,
  USER: (orgId, userId) => `/orgs/${orgId}/users/${userId}/`,

  // Search
  SEARCH_TASKS: (orgId) => `/orgs/${orgId}/search/tasks/`,
  SEARCH_PROJECTS: (orgId) => `/orgs/${orgId}/search/projects/`,
  SEARCH_USERS: (orgId) => `/orgs/${orgId}/search/users/`,
};

export default ENDPOINTS;
