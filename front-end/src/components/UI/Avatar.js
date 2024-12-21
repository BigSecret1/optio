import React from 'react';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';



// Avatar for user uses image or alternative name
export default function FallbackAvatars() {
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