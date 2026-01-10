import { SERVER_HOST } from "../constants";

export const BASE_URL = SERVER_HOST;
const ENDPOINTS = {
  SEARCH_TASK: "/search/task/",
  SEARCH_PROJECT: "/search/project/",
  SEARCH_USER: "/search/user/",
  ADD_COMMENT: "/comments/",
  DELETE_COMMENT: (commentId) => `/comments/delete/${commentId}/`,
  GET_SUBTASKS: (parentTaskId) => `/tasks/${parentTaskId}/subtasks/`,
  CREATE_SUBTASK: "/tasks/create-subtask/",
};

export default ENDPOINTS;
