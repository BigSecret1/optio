import * as React from 'react';

export default function FormDialog() {

  const [task, setTask] = React.useState({
    title: "Task under project 7 number 2",
    project_id: 7,
    subtasks: [
      "Some other tasks to perform",
      "Implement fixes"
    ],
    due_date: "2024-06-24",
    comments: [
      "Make task as pending task",
      "Coordinate with QA for testing"
    ],
    description: "Addressing reported bugs in the application",
    task_status: "Pending"
  });

  const [newComment, setNewComment] = React.useState("");

  const handleTitleChange = (e) => {
    setTask({ ...task, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setTask({ ...task, description: e.target.value });
  };

  const handleSubtaskChange = (index, value) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks[index] = value;
    setTask({ ...task, subtasks: newSubtasks });
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() !== "") {
      setTask({ ...task, comments: [...task.comments, newComment] });
      setNewComment("");
    }
  };

  return (
    <>
      <div>
        <h2>
          <input
            type="text"
            value={task.title}
            onChange={handleTitleChange}
            style={{ width: '100%', fontSize: '1.5em', fontWeight: 'bold' }}
          />
        </h2>
      </div>

      <div>
        <h4>Description:</h4>
        <textarea
          rows="5"
          cols="100"
          value={task.description}
          onChange={handleDescriptionChange}
          placeholder="Enter the task description here..."
        />
      </div>

      <div>
        <h4>Sub Tasks</h4>
        <ul>
          {task.subtasks.map((subtask, index) => (
            <li key={index}>
              <input
                type="text"
                value={subtask}
                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                style={{ width: '100%' }}
              />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Comments</h4>
        <hr style={{ border: '1px solid white', margin: '20px 0' }} />
        <ul>
          {task.comments.map((comment, index) => (
            <li key={index}>
              {comment}
            </li>
          ))}
        </ul>
        <textarea
          rows="5"
          cols="100"
          value={newComment}
          onChange={handleNewCommentChange}
          placeholder="Enter your comments here..."
        />
        <button onClick={handleCommentSubmit}>Add Comment</button>
      </div>
    </>
  );
}
