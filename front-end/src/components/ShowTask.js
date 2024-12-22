import React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';

// matrical UI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// Font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

// Internal modules
import { StateContext } from './TaskStateProvider';
import './ShowTask.css';
import OptionMenu from './UI/OptionMenu';

// Child components
import FallbackAvatars from './UI/Avatar.js';
import EllipsisWithSpacing from './UI/ThreeDots.js';
import Header from './task/header-section/Header.js'



/*
    * The primary component which is responsible to show an opened task.
    * All the child components are divded into different section for e.g.
    * header-section, descriptio-sectioin etc.
*/
export default function ShowTasks({ taskId }) {
    const {
        task, setTask,
        loading, setLoading,
        taskService,
        getUpdatedTask
    } = useContext(StateContext);

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
            <Header taskId={taskId} />

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