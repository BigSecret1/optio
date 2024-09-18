import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import './ShowTask.css';
import TextField from '@mui/material/TextField';


export default function ShowTasks() {
    return (
        <div style={{ width: '100%' }}>
            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        height: '10vh',
                        bgcolor: '#304971',
                        color: 'white',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'white',
                            borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                <h3>Finish the front end task layout in this week end to end</h3>
            </Box>
            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        height: '30vh',
                        bgcolor: '#304971',
                        color: 'white',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'white',
                            borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                <h3>Description</h3>
            </Box>

            <Box
                sx={[
                    (theme) => ({
                        display: 'flex',
                        m: 1,
                        p: 1,
                        height: '40vh',
                        overflow: 'auto',
                        bgcolor: '#304971',
                        position: 'relative',
                        color: 'white',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'white',
                            borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                <h3>SubTasks</h3>
                <div className='subTasks'>
                    <div className='taskItem'>
                        <input type='checkbox' />
                        <h6>Lay down all elementin one row</h6>
                    </div>
                    <div className='taskItem'>
                        <input type='checkbox' />
                        <h6>Lay down all elementin one row</h6>
                    </div>
                    <div className='taskItem'>
                        <input type='checkbox' />
                        <h6>Lay down all elementin one row</h6>
                    </div>
                    <div className='taskItem'>
                        <input type='checkbox' />
                        <h6>Lay down all elementin one row</h6>
                    </div>
                    <div className='taskItem'>
                        <input type='checkbox' />
                        <h6>Lay down all elementin one row</h6>
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
                        border: '1px solid',
                        borderColor: 'grey-300',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        ...theme.applyStyles('dark', {
                            bgcolor: '#101010',
                            color: 'white',
                            borderColor: 'grey.800',
                        }),
                    }),
                ]}
            >
                <div className="comments">
                    <h3>Comments</h3>
                    <div className="commentBox">
                        <TextField id="filled-basic" label="Add a comment" variant="filled" />
                        <button type="button" className="btn btn-outline-success">Success</button>                    </div>
                    <div className="commentHeader">
                        <h5>0 Comments</h5>
                    </div>
                    <div className="comment">
                        <h6>Added on Sep 15 2024: 11:40 IST</h6>
                        <hr style={{ border: "1px solid white" }} />
                        <p>This is my first comment on given</p>
                    </div>
                    <div className="comment">
                        <h6>Added on Sep 15 2024: 11:40 IST</h6>
                        <hr style={{ border: "1px solid white" }} />
                        <p>This is my first comment on given</p>
                    </div>
                    <div className="comment">
                        <h6>Added on Sep 15 2024: 11:40 IST</h6>
                        <hr style={{ border: "1px solid white" }} />
                        <p>This is my first comment on given</p>
                    </div>
                </div>
            </Box >
        </div >
    );
}