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

// For Dialogue box which comes after menu option selection
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

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
        getUpdatedTask
    } = useContext(StateContext);

    const menuOptionsForTitleBox = ["Edit title", "Change status", "Change assignee"];
    const menuOptionsForDescription = ["Edit description"]

    useEffect(() => {
        getUpdatedTask(taskId);
    }, [taskId]);

    const [newComment, setNewComment] = useState("");

    async function handleAddComment() {
        taskService.updateTask({ id: taskId, comments: [newComment] });
        getUpdatedTask(taskId);
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
                        <OptionMenu options={menuOptionsForTitleBox}>
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
                        <OptionMenu options={menuOptionsForDescription}>
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


function ShowTaskTitle({ task }) {
    return (
        <div className="taskTitle">
            <h3>{task.title}</h3>
        </div>
    );
}


/* 
Three Dot component which open option Menu on Click.
Used in multiple child components of this module.
*/
function EllipsisWithSpacing({ containerClass }) {
    return (
        <div className={containerClass}>
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
        </div>
    );
}


/*
A Dialogue box which popups when choose to edit task title
*/
function EditTaskTitle({ taskId }) {
    const {
        task,
        setTask,
        loading,
        setLoading,
        editTaskTitle,
        setEditTaskTitle,
        taskService,
        getUpdatedTask,
        open, setOpen,
    } = useContext(StateContext);

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');

    const [taskTitle, setTaskTitle] = useState(task.title);

    const change = "Task title";
    const changeInfo = "Feel free to update your task title."

    function handleEditTitle(event) {
        setTaskTitle(event.target.value);
    }

    // function handleClickOpen() {
    //     setOpen(true);
    // };

    function handleClose() {
        setOpen(false);
    };

    function handleSave() {
        console.log("Saving task with new title", taskTitle);
        taskService.updateTask({ id: taskId, title: taskTitle });
        getUpdatedTask(taskId);
        setOpen(false);
        setEditTaskTitle(false);
    }

    return (
        <>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open max-width dialog
            </Button> */}
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{change}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {changeInfo}
                    </DialogContentText>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <input name="taskTitle" onChange={handleEditTitle} value={taskTitle} />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


function ChangeTaskStatus({ taskId }) {
    const {
        task,
        setTask,
        loading,
        setLoading,
        editTaskTitle,
        setEditTaskTitle,
        taskService,
        getUpdatedTask,
        open, setOpen,
    } = useContext(StateContext);

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');

    const [taskTitle, setTaskTitle] = useState(task.title);

    const change = "Task title";
    const changeInfo = "Feel free to update your task title."

    function handleEditTitle(event) {
        setTaskTitle(event.target.value);
    }

    // function handleClickOpen() {
    //     setOpen(true);
    // };

    function handleClose() {
        setOpen(false);
    };

    function handleSave() {
        console.log("Saving task with new title", taskTitle);
        taskService.updateTask({ id: taskId, title: taskTitle });
        getUpdatedTask(taskId);
        setOpen(false);
        setEditTaskTitle(false);
    }

    return (
        <>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open max-width dialog
            </Button> */}
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{change}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {changeInfo}
                    </DialogContentText>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <h1>some random heading</h1>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


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
