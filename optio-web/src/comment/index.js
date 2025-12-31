import ApiManager from "../api-manager/api-manager";

export default class CommentService {
  static addComment(comment, taskId) {
    const payload = {
      comment,
      task: taskId,
    };
    return ApiManager.addComment(payload);
  }
}
