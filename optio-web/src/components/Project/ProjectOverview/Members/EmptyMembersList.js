import React from "react";

import { Avatar, Stack, Typography } from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

export default function EmptyMemberstList() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ py: 3 }}
      spacing={1}
    >
      <Avatar>
        <PersonAddAlt1RoundedIcon />
      </Avatar>
      <Typography variant="body2" color="text.secondary">
        No members yet. Use the search above to add people.
      </Typography>
    </Stack>
  );
}
