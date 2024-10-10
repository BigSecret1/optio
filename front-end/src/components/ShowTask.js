import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import './ShowTask.css';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faDotCircle as farDotCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Task from './task-service';



export default function ShowTasks({ taskId }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editTaskTitle, setEditTaskTitle] = useState(true);
    const taskService = new Task();

    useEffect(() => {
        getTask();
    }, [taskId]);

    async function getTask() {
        const currentTask = await taskService.getTask(taskId);
        console.log("CURRENT TASK ", currentTask);
        setLoading(false);

        // For latest comment to come on top
        currentTask.comments.reverse();
        setTask(currentTask);
    }

    const [newComment, setNewComment] = useState("");

    async function handleAddComment() {
        taskService.updateTask({ id: taskId, comment: newComment });
        getTask();
        setNewComment("");
    }

    return loading ? <p>Loading Task...</p> : (
        <div style={{ width: '100%' }}>
            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        minHeight: '10vh',
                        height: 'auto',
                        bgcolor: '#304971',
                        color: 'white',
                        border: '0.5px solid',
                        borderColor: '#3F5880',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            // bgcolor: '#101010',
                            color: 'white',
                            // borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                {editTaskTitle === false ? <ShowTaskTitle task={task} /> : <EditTaskTitle task={task} />}
            </Box>

            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        minHeight: '30vh',
                        height: 'auto',
                        bgcolor: '#304971',
                        color: 'white',
                        border: '0.5px solid',
                        borderColor: '#3F5880',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'white',
                            // borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                <div>
                    <h3>Description</h3>
                    <p>{task.description}</p>
                </div>

            </Box>

            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        // minHeight: '40vh',
                        // height: 'auto',
                        bgcolor: '#304971',
                        position: 'relative',
                        color: 'white',
                        border: '0.5px solid',
                        borderColor: '#3F5880',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'white',
                            // borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                <div className="subTasksContainer">
                    <h3>SubTasks</h3>
                    <div className='subTasks'>
                        {task.subtasks.map((subtask, index) => {
                            return (
                                <div className='taskItem' key={index}>
                                    <input type="checkbox" />
                                    <h5>{subtask}</h5>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </Box>

            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        minHeight: '49vh',
                        height: 'auto',
                        bgcolor: '#304971',
                        color: 'white',
                        border: '0.5px solid',
                        borderColor: '#3F5880',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'white',
                            // borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                <div className="comments">
                    <h3>Comments</h3>

                    <div className="commentBox">
                        <TextField
                            id="filled-textarea"
                            placeholder='Add a comment...'
                            multiline
                            variant="filled"
                            value={newComment}
                            onChange={(event) => setNewComment(event.target.value)}
                            InputLabelProps={{
                                style: { color: 'white' }
                            }}
                        />
                        <button type="button" className="btn btn-outline-success" onClick={handleAddComment}>comment</button>
                    </div>

                    <div className="commentHeader">
                        <h5>{task.comments.length} Comments</h5>
                    </div>
                    {
                        task.comments.map((comment, index) => {
                            return (
                                <div className="comment" key={index}>
                                    <h6>Added on Sep 15 2024: 11:40 IST</h6>
                                    <p>{comment}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </Box >
        </div >
    );
}


const ShowTaskTitle = ({ task }) => {
    return (
        <div className="taskTitle">
            {
                task.task_status === 'completed' ? (
                    <FontAwesomeIcon icon={farCheckCircle} size="2x" color="green" />
                ) : task.task_status === 'in progress' ? (
                    <FontAwesomeIcon icon={farDotCircle} size="2x" color="yellow" />
                ) : (
                    <FontAwesomeIcon icon={farCircle} size="2x" color="blue" />
                )
            }
            <h3>{task.title}</h3>
        </div>
    );
}


const EditTaskTitle = ({ task }) => {
    const [taskTitle, setTaskTitle] = useState(task.title);

    function handleSave() {
        console.log("save the new title");
    }

    function handleCancel() {
        console.log("cancelling the udpate");
    }

    return (
        <>
            <input
                type="text" value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
            />
            <FontAwesomeIcon icon={faCheck} onClick={handleSave} />
            <FontAwesomeIcon icon={faXmark} color="red" onClick={handleCancel} />
        </>
    );
}