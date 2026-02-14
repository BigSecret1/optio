import ApiMethods from "./api-methods";
import ENDPOINTS from "./endpoints";

export default class ApiManager {
  static searchTask(params) {
    const url = ENDPOINTS.SEARCH_TASK;
    return ApiMethods.post(url, params);
  }

  static searchProject(param) {
    const url = ENDPOINTS.SEARCH_PROJECT;
    return ApiMethods.post(url, param);
  }

  static searchUser(param) {
    const url = ENDPOINTS.SEARCH_USER;
    return ApiMethods.post(url, param);
  }

  static addComment(param) {
    const url = ENDPOINTS.ADD_COMMENT;
    return ApiMethods.post(url, param);
  }

  static deleteComment(commentId) {
    const url = ENDPOINTS.DELETE_COMMENT(commentId);
    return ApiMethods.delete(url);
  }

  static getSubtasks(parentTaskId) {
    const url = ENDPOINTS.GET_SUBTASKS(parentTaskId);
    return ApiMethods.get(url);
  }

  static createSubtask(param) {
    const url = ENDPOINTS.CREATE_SUBTASK;
    return ApiMethods.post(url, param);
  }

  static addProjectMemebers(param, projectId) {
    const url = ENDPOINTS.ADD_PROJECT_MEMEBERS(projectId);
    return ApiMethods.post(url, param);
  }

  static fetchProjectMembers(projectId) {
    const url = ENDPOINTS.FETCH_PROJECT_MEMBERS(projectId);
    return ApiMethods.get(url);
  }

  static fetchProject(projectId) {
    const url = ENDPOINTS.FETCH_PROJECT(projectId);
    return ApiMethods.get(url);
  }
}
