import { SERVER_HOST } from "../constants";

export const BASE_URL = SERVER_HOST;
const ENDPOINTS = {
  SEARCH_TASK: "/search/task/",
  SEARCH_PROJECT: "/search/project/",
  SEARCH_USER: "/search/user/",
  ADD_COMMENT: "/comments/",
};

export default ENDPOINTS;
