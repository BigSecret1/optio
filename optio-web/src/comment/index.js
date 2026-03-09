import ApiManager from "../api-client/api-manager";

export default class CommentService {
  static addComment(comment, taskId) {
    const payload = {
      comment,
      task: taskId,
    };
    return ApiManager.addComment(payload);
  }

  static deleteComment(commentId) {
    return ApiManager.deleteComment(commentId);
  }
}
