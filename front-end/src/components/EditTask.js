import * as React from 'react';
import './EditTask.css';

export default function FormDialog() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [mainTask, setMainTask] = React.useState({
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMainTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = [...mainTask.subtasks];
    updatedSubtasks[index] = value;
    setMainTask(prevTask => ({ ...prevTask, subtasks: updatedSubtasks }));
  };

  const handleAddSubtask = () => {
    setMainTask(prevTask => ({
      ...prevTask,
      subtasks: [...prevTask.subtasks, ""]
    }));
  };

  const handleAddComment = () => {
    setMainTask(prevTask => ({
      ...prevTask,
      comments: [...prevTask.comments, ""]
    }));
  };

  const handleCommentChange = (index, value) => {
    const updatedComments = [...mainTask.comments];
    updatedComments[index] = value;
    setMainTask(prevTask => ({ ...prevTask, comments: updatedComments }));
  };

  return (
    <div className={isEditing ? 'formContainer' : 'fullScreenContainer'}>
      <div className="header">
        {isEditing ? (
          <>
            <button className="saveBtn" onClick={handleSave}>Save</button>
            <button className="cancelBtn" onClick={handleCancel}>Cancel</button>
          </>
        ) : null}
      </div>

      <div className="taskHeader">
        <h2>{mainTask.title}</h2>
        {!isEditing && (
          <button className="editBtn" onClick={handleEdit}>Edit</button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave}>
          <h4>Description:</h4>
          <textarea
            name="description"
            value={mainTask.description}
            onChange={handleChange}
            rows="4"
            className="descriptionInput"
          />

          <h4>Sub Tasks</h4>
          <ul className="subtaskList">
            {mainTask.subtasks.map((subtask, index) => (
              <li key={index} className="subtaskItem">
                <input type="checkbox" id={`subtask-${index}`} />
                <input
                  type="text"
                  value={subtask}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  className="subtaskInput"
                />
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleAddSubtask} className="addSubtaskBtn">Add Subtask</button>

          <h4>Comments</h4>
          <ul className="commentsList">
            {mainTask.comments.map((comment, index) => (
              <li key={index} className="commentItem">
                <textarea
                  value={comment}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  rows="2"
                  className="commentInput"
                  placeholder="Enter your comments here..."
                />
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleAddComment} className="addCommentBtn">Add Comment</button>
        </form>
      ) : (
        <>
          <h4>Description:</h4>
          <p>{mainTask.description}</p>
          <h4>Sub Tasks</h4>
          <ul className="subtaskList">
            {mainTask.subtasks.map((subtask, index) => (
              <li key={index} className="subtaskItem">
                <input type="checkbox" id={`subtask-${index}`} />
                <label htmlFor={`subtask-${index}`}>
                  {subtask}
                </label>
              </li>
            ))}
          </ul>
          <h4>Comments</h4>
          <ul className="commentsList">
            {mainTask.comments.map((comment, index) => (
              <li key={index} className="commentItem">
                <p>{comment}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

