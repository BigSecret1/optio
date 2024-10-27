import * as React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import './ShowTask.css';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faDotCircle as farDotCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { StateContext } from './TaskStateProvider';
import { Link } from 'react-router-dom';



// End of imports



export default function ShowTasks({ taskId }) {
    const {
        task,
        setTask,
        loading,
        setLoading,
        editTaskTitle,
        setEditTaskTitle,
        taskService,
        getTask
    } = useContext(StateContext);

    useEffect(() => {
        getTask(taskId);
    }, [taskId]);

    const [newComment, setNewComment] = useState("");

    async function handleAddComment() {
        taskService.updateTask({ id: taskId, comments: [newComment] });
        getTask(taskId);
        setNewComment("");
    }

    return loading ? <p>Loading Task...</p> : (
        <div style={{ width: '100%' }}>
            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
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
                <div className='taskStatusHeader'>
                    {
                        task.task_status === 'completed' ? (
                            <FontAwesomeIcon icon={farCheckCircle} size="2x" color="green" />
                        ) : task.task_status === 'in progress' ? (
                            <FontAwesomeIcon icon={farDotCircle} size="2x" color="yellow" />
                        ) : (
                            <FontAwesomeIcon icon={farCircle} size="2x" color="blue" />
                        )
                    }

                    <Link>
                        <h6>GSMI/1248</h6>
                    </Link>
                    <EllipsisWithSpacing containerClass="dotsForTitle" />
                </div>
                {
                    editTaskTitle === false ? <ShowTaskTitle task={task} /> : <EditTaskTitle taskId={taskId} />
                }

            </Box >

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
            <h3>{task.title}</h3>

            {/* <FontAwesomeIcon icon={faEllipsisH} style={{ letterSpacing: '200px' }} /> */}
        </div>

    );
}


const EditTaskTitle = ({ taskId }) => {
    const [taskTitle, setTaskTitle] = useState("");
    const { editTaskTitle, setEditTaskTitle, taskService, getTask } = useContext(StateContext);

    if (editTaskTitle == false) return;

    async function handleSave() {
        console.log(`Saving task with id ${taskId} and title ${taskTitle}`);
        await taskService.updateTask({ id: taskId, title: taskTitle });
        getTask(taskId);
        setEditTaskTitle(false);
    }

    function handleCancel() {
        setTaskTitle("");
        setEditTaskTitle(false);
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


// 3 Dot component used in umultiple child components of this module
const EllipsisWithSpacing = ({ containerClass }) => (
    <div className={containerClass}>
        <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
        <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em'}} />
        <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
    </div>
);  
