import React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';

// matrical UI
import Box from '@mui/material/Box';

// Font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faDotCircle as farDotCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';

// Internal modules
import { StateContext } from '../../TaskStateProvider.js';
import OptionMenu from '../../UI/OptionMenu.js';

// Child components
import UpdateTaskStatus from './UpdateTaskStatus.js';
import EllipsisWithSpacing from '../../UI/ThreeDots.js';
import UpdateTaskTitle from './UpdateTaskTitle.js';



/*
    * This component contains(parent component of)  all the child components which helps to build header
    * of an opened task.
*/
export default function Header({ taskId }) {
    const {
        task, setTask,
        loading, setLoading,
        editTaskTitle, setEditTaskTitle,
        taskService,
        getUpdatedTask,
        open, setOpen,
        openChangeStatus, setOpenChangeStatus,
    } = useContext(StateContext);

    const menuOptionsForTitleBox = ["Edit title", "Change status", "Change assignee"];

    return (
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
                    openChangeStatus === true ? (
                        <UpdateTaskStatus taskId={taskId} />
                    ) : (
                        task.task_status.toLowerCase() === 'completed' ? (
                            <FontAwesomeIcon icon={farCheckCircle} size="2x" color="green" className="statusIcon" />
                        ) : task.task_status.toLowerCase() === 'in progress' ? (
                            <FontAwesomeIcon icon={farDotCircle} size="2x" color="yellow" className="statusIcon" />
                        ) : (
                            <FontAwesomeIcon icon={farCircle} size="2x" color="blue" className="statusIcon" />
                        )
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
            <div className="taskTitle">
                <h3>{task.title}</h3>
            </div>
            {
                editTaskTitle === true ? <UpdateTaskTitle taskId={taskId} /> : null
            }
        </Box >
    );

}