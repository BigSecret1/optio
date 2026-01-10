import ApiManager from "../api-manager/api-manager";

export default class TaskService {
  static getSubtasks(parentTaskId) {
    return ApiManager.getSubtasks(parentTaskId);
  }

  static createSubtask(param) {
    return ApiManager.createSubtask(param);
  }
}
