import React from "react";

import Avatar from "@mui/material/Avatar"; // ✅ MUI Avatar
import Stack from "@mui/material/Stack";
import { deepOrange } from "@mui/material/colors";

import "./styles/avatar.css";

function UserAvatar() {
  return (
    <div className="avatar-wrapper">
      <Stack direction="row" spacing={2}>
        <Avatar
          sx={{ bgcolor: deepOrange[500] }}
          alt="Dinesh Balotiya"
          src="/broken-image.jpg"
        />
      </Stack>
    </div>
  );
}

export default UserAvatar;
