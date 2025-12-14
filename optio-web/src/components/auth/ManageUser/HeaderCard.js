import React from "react";

import { Box, Avatar, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import TOKENS from "./utils";

export default function HeaderCard({
  title = "Create New User",
  subtitle = "Add a user and assign a role",
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Avatar sx={{ bgcolor: TOKENS.accent, width: 48, height: 48 }}>
        <LockOutlinedIcon sx={{ color: "#002027" }} />
      </Avatar>

      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: TOKENS.textColor }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: TOKENS.helperColor, mt: 0.3 }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}
