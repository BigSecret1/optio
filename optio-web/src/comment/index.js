import ApiManager from "../api-manager/api-manager";

export default class CommentService {
  static addComment(comment, taskId) {
    const payload = {
      comment,
      task: taskId,
    };
    console.log("Adding comment with payload ", payload);
    return ApiManager.addComment(payload);
  }
}
