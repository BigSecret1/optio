import ApiMethods from "./api-methods";
import ENDPOINTS from "./endpoints";

class ApiManager {
  static searchTask(params) {
    const url = ENDPOINTS.SEARCH_TASK;
    return ApiMethods.post(url, params);
  }
}

export default ApiManager;
