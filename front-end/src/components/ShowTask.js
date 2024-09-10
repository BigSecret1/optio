import * as React from 'react';
import Box from '@mui/material/Box';

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
                        height: '50vh',
                        overflow: 'auto',
                        bgcolor: '#304971',
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
                <h3>Comments</h3>
                <div className='commentBox'>
                    <textarea rows="10" cols="120"></textarea>
                </div>
            </Box>
        </div>
    );
}