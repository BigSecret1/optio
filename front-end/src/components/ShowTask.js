import React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';

// matrical UI
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';

// Font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faDotCircle as farDotCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

// Internal modules
import { StateContext } from './TaskStateProvider';
import './ShowTask.css';
import OptionMenu from './UI/OptionMenu';



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

    // Tasks title option menu can have
    // 1. Edit task title
    // 2. Change task status
    // 3. Task assignee
    const menuOptionsForTitleBox = ["Edit title", "Change status", "Change assignee"];

    useEffect(() => {
        getTask(taskId);
    }, [taskId]);

    const [newComment, setNewComment] = useState("");

    async function handleAddComment() {
        taskService.updateTask({ id: taskId, comments: [newComment] });
        getTask(taskId);
        setNewComment("");
    }

    function handleTaskTitleOptions() {
        console.log("clicked on option button");
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
                <div className='taskTitleHeader'>
                    {
                        task.task_status === 'completed' ? (
                            <FontAwesomeIcon icon={farCheckCircle} size="2x" color="green" className="statusIcon" />
                        ) : task.task_status === 'in progress' ? (
                            <FontAwesomeIcon icon={farDotCircle} size="2x" color="yellow" className="statusIcon" />
                        ) : (
                            <FontAwesomeIcon icon={farCircle} size="2x" color="blue" className="statusIcon" />
                        )
                    }

                    <Link>
                        <h5>GSMI/1248</h5>
                    </Link>
                    <div className="optionMenuEllipsContainer">
                        <OptionMenu >
                            <EllipsisWithSpacing containerClass="optionDots" />
                        </OptionMenu>
                    </div>
                </div>
                {
                    editTaskTitle === false ? <ShowTaskTitle task={task} /> : <EditTaskTitle taskId={taskId} />
                }

            </Box >

            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
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
                <div className="descriptionHeader">
                    <h3>Description</h3>
                    <div className="optionMenuEllipsContainer">
                        <OptionMenu>
                            <EllipsisWithSpacing containerClass="optionDots" />
                        </OptionMenu>
                    </div>
                </div>
                <p>{task.description}</p>

            </Box>

            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
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
                <div className="subTaskHeader">
                    <h3>SubTasks</h3>
                    <EllipsisWithSpacing containerClass="optionDots" />
                </div>

                <div className="subTasksContainer">
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
                                    <FallbackAvatars />
                                    <h6>Added on Sep 15 2024: 11:40 IST</h6>
                                    <p>{comment}</p>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                    <hr />
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
const EllipsisWithSpacing = ({ containerClass, invokeFunctionOnClick }) => (
    <div className={containerClass} onClick={invokeFunctionOnClick}>
        <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
        <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
        <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
    </div>
);


// Avatar for user uses image or alternative name
function FallbackAvatars() {
    return (
        <Stack direction="row" spacing={2}>
            <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                alt="Demmy lovato"
                src="/broken-image.jpg"
            />
        </Stack>
    );
}


