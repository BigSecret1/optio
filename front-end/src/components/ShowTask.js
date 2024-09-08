import React from "react";
import Box from '@mui/material/Box';
import './ShowTask.css'


function ShowTask() {
    return (
        <>
            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        height: '45px',
                        bgcolor: '#fff',
                        color: 'grey.800',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'grey.300',
                            borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                {"I'm a flexbox container that uses flex!"}
            </Box>



            <div className="descriptionSubTasks">
                <div className="description">
                    <Box
                        sx={[
                            (theme) => ({
                                display: 'flext',
                                m: 1,
                                width: '100%',
                                p: 1,
                                height: '100px',
                                bgcolor: '#fff',
                                color: 'grey.800',
                                border: '1px solid',
                                borderColor: 'grey.300',
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                ...theme.applyStyles('dark', {
                                    bgcolor: '#101010',
                                    color: 'grey.300',
                                    borderColor: 'grey.800',
                                }),
                            }),
                        ]}
                    >
                        {"I'm a flexbox container that uses flex!"}
                    </Box>
                </div>

                <div className="subTasks">
                    <Box
                        sx={[
                            (theme) => ({
                                display: 'flext',
                                m: 1,
                                width: '50%',
                                p: 1,
                                height: '80%',
                                width: '100%',
                                bgcolor: '#fff',
                                color: 'grey.800',
                                border: '1px solid',
                                borderColor: 'grey.300',
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                ...theme.applyStyles('dark', {
                                    bgcolor: '#101010',
                                    color: 'grey.300',
                                    borderColor: 'grey.800',
                                }),
                            }),
                        ]}
                    >
                        {"Ehse are for subtasks"}
                    </Box>
                </div>
            </div>

            <div className="comments">
                <Box
                    sx={[
                        (theme) => ({
                            display: 'flext',
                            m: 1,
                            width: '100%',
                            height: '90%',
                            p: 1,
                            bgcolor: '#fff',
                            color: 'grey.800',
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 2,
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            ...theme.applyStyles('dark', {
                                bgcolor: '#101010',
                                color: 'grey.300',
                                borderColor: 'grey.800',
                            }),
                        }),
                    ]}
                >
                    {"I'm a flexbox container that uses flex!"}
                </Box>
            </div>


        </>
    );
}

export default ShowTask;