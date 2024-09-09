import React from "react";
import Box from '@mui/material/Box';
import './ShowTask.css'


function ShowTask() {
    return (
        <>
            <div class="container">
                <div class="column column-1">
                    <div class="box small-box"></div>
                    <div class="box small-box"></div>

                </div>
                <div class="column column-2">
                    <div class="box big-box"></div>
                </div>
            </div>

        </>
    );
}

export default ShowTask;