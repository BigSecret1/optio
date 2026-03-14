import ApiMethods from "./api-methods";
import ENDPOINTS, { getOrgId } from "./endpoints";

export default class ApiManager {
  // Auth
  static login(params) {
    return ApiMethods.post(ENDPOINTS.LOGIN, params);
  }

  static logout(params) {
    return ApiMethods.post(ENDPOINTS.LOGOUT, params);
  }

  static refreshToken(params) {
    return ApiMethods.post(ENDPOINTS.TOKEN_REFRESH, params);
  }

  // Tasks
  static getTasksByProject(projectId, orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.TASKS(orgId) + `?project_id=${projectId}`);
  }

  static getTask(taskId, orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.TASK(orgId, taskId));
  }

  static createTask(params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.TASKS(orgId), params);
  }

  static updateTask(taskId, params, orgId = getOrgId()) {
    return ApiMethods.patch(ENDPOINTS.TASK(orgId, taskId), params);
  }

  static deleteTask(taskId, orgId = getOrgId()) {
    return ApiMethods.delete(ENDPOINTS.TASK(orgId, taskId));
  }

  // Comments
  static getComments(taskId, orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.TASK_COMMENTS(orgId, taskId));
  }

  static addComment(taskId, params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.TASK_COMMENTS(orgId, taskId), params);
  }

  static updateComment(commentId, params, orgId = getOrgId()) {
    return ApiMethods.patch(ENDPOINTS.COMMENT(orgId, commentId), params);
  }

  static deleteComment(commentId, orgId = getOrgId()) {
    return ApiMethods.delete(ENDPOINTS.COMMENT(orgId, commentId));
  }

  // Projects
  static getProjects(orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.PROJECTS(orgId));
  }

  static getProject(projectId, orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.PROJECT(orgId, projectId));
  }

  static createProject(params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.PROJECTS(orgId), params);
  }

  static updateProject(projectId, params, orgId = getOrgId()) {
    return ApiMethods.patch(ENDPOINTS.PROJECT(orgId, projectId), params);
  }

  static deleteProject(projectId, orgId = getOrgId()) {
    return ApiMethods.delete(ENDPOINTS.PROJECT(orgId, projectId));
  }

  static getProjectUsers(projectId, orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.PROJECT_USERS(orgId, projectId));
  }

  static addProjectUsers(projectId, params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.PROJECT_USERS(orgId, projectId), params);
  }

  // Users
  static getUsers(orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.USERS(orgId));
  }

  static getUser(userId, orgId = getOrgId()) {
    return ApiMethods.get(ENDPOINTS.USER(orgId, userId));
  }

  static createUser(params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.USERS(orgId), params);
  }

  static updateUser(userId, params, orgId = getOrgId()) {
    return ApiMethods.patch(ENDPOINTS.USER(orgId, userId), params);
  }

  static deleteUser(userId, orgId = getOrgId()) {
    return ApiMethods.delete(ENDPOINTS.USER(orgId, userId));
  }

  // Search
  static searchTasks(params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.SEARCH_TASKS(orgId), params);
  }

  static searchProjects(params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.SEARCH_PROJECTS(orgId), params);
  }

  static searchUsers(params, orgId = getOrgId()) {
    return ApiMethods.post(ENDPOINTS.SEARCH_USERS(orgId), params);
  }
}
