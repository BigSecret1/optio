import { SERVER_HOST } from "../constants";

const currentOrgId = localStorage.getItem("currentOrganizationId");

export const BASE_URL = SERVER_HOST + "/api";

const ENDPOINTS = {
  USER_LOGIN: "/security/login/",
  SEARCH_TASK: "/search/task/",
  SEARCH_PROJECT: "/search/project/",
  SEARCH_USER: "/search/user/",
  ADD_COMMENT: "/comments/",
  DELETE_COMMENT: (commentId) => `/comments/delete/${commentId}/`,
  CREATE_TASK: "/tasks/create/",
  GET_SUBTASKS: (parentTaskId) => `/tasks/${parentTaskId}/subtasks/`,
  CREATE_SUBTASK: "/tasks/create-subtask/",
  FETCH_PROJECTS: `/orgs/${currentOrgId}/projects/`,
  ADD_PROJECT_MEMEBERS: (projectId) => `/api/projects/${projectId}/users/`,
  FETCH_PROJECT_MEMBERS: (projectId) => `/api/projects/${projectId}/users/`,
  FETCH_PROJECT: (projectId) => `/api/projects/${projectId}/`,
  EDIT_PROJECT: (projectId) => `/api/projects/${projectId}/`,
};

export default ENDPOINTS;
