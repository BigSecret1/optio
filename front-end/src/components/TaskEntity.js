class Task {
    constructor(
        title,
        projectId,
        id,
        subtasks,
        dueDate,
        comments,
        description,
        taskStatus
    ) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.subtasks = subtasks;
        this.comments = comments;
        this.dueDate = dueDate;
        this.description = description;
        this.taskStatus = taskStatus;
    }
}

export default Task;
