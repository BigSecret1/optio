import React from "react";

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import EmptyMemberstList from "./EmptyMembersList";
import initials from "./utils/initials";

export default function MemberList({ members, onRemove }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        Current members
      </Typography>
      <List
        dense
        disablePadding
        sx={{
          mt: 1,
          borderRadius: 2,
          border: (t) => `1px dashed ${t.palette.divider}`,
        }}
      >
        {members.length === 0 ? (
          <EmptyMemberstList />
        ) : (
          members.map((m, idx) => (
            <React.Fragment key={m.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`remove ${m.name}`}
                    onClick={() => onRemove(m.id)}
                  >
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={m.avatarUrl}>{initials(m.name)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600}>
                      {m.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {m.email}
                    </Typography>
                  }
                />
              </ListItem>
              {idx < members.length - 1 && (
                <Divider component="li" sx={{ mx: 2 }} />
              )}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
}
