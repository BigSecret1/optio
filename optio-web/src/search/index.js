import { SERVER_HOST } from "../constants";
import { getToken } from "../user/actions/token";
import ApiManager from "../api-manager/api-manager";

class SearchStrategy {
  search(query) {
    throw new Error("search() must be implemented.");
  }
}

class TaskSearchStrategy extends SearchStrategy {
  constructor() {
    super();
  }

  search(query) {
    return ApiManager.searchTask(query);
  }
}

class ProjectSearchStrategy extends SearchStrategy {
  constructor() {
    super();
  }

  search(query) {
    return ApiManager.searchProject(query);
  }
}

class UserSearchStrategy extends SearchStrategy {
  constructor() {
    super();
  }

  search(query) {
    return ApiManager.searchUser(query);
  }
}

class SearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  executeSearch(query) {
    return this.strategy.search(query);
  }
}

const searchContext = new SearchContext(new TaskSearchStrategy());

const taskSearchStrategy = new TaskSearchStrategy();
const projectSearchStrategy = new ProjectSearchStrategy();
const userSearchStrategy = new UserSearchStrategy();

export { searchContext, taskSearchStrategy, projectSearchStrategy, userSearchStrategy };
