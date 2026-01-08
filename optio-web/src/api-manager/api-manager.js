import ApiMethods from "./api-methods";
import ENDPOINTS from "./endpoints";

class ApiManager {
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
}

export default ApiManager;
