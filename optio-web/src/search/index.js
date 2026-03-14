import ApiManager from "../api-client/api-manager";

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
    return ApiManager.searchTasks(query);
  }
}

class ProjectSearchStrategy extends SearchStrategy {
  constructor() {
    super();
  }

  search(query) {
    return ApiManager.searchProjects(query);
  }
}

class UserSearchStrategy extends SearchStrategy {
  constructor() {
    super();
  }

  search(query) {
    return ApiManager.searchUsers(query);
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

export {
  searchContext,
  taskSearchStrategy,
  projectSearchStrategy,
  userSearchStrategy,
};
