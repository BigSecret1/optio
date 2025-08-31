import React, { useCallback, useMemo } from "react";

import {
  Avatar,
  AvatarGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import Search from "./Search";
import MembersList from "./MembersList";
import initials from "./utils/initials";

export default function ManageMembers({
  open,
  onClose,
  members,
  onChangeMembers,
  fetchUsers,
  title = "Manage members",
}) {
  const memberIds = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  const handleAdd = useCallback(
    (user) => {
      if (memberIds.has(user.id)) return;
      onChangeMembers([...members, user]);
    },
    [memberIds, members, onChangeMembers]
  );

  const handleRemove = useCallback(
    (userId) => {
      onChangeMembers(members.filter((m) => m.id !== userId));
    },
    [members, onChangeMembers]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ backdrop: { sx: { backdropFilter: "blur(2px)" } } }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "hidden",
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          boxShadow: (t) => t.shadows[8],
        },
      }}
    >
      <DialogTitle sx={{ py: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 },
            }}
          >
            {members.map((m) => (
              <Avatar key={m.id} alt={m.name} src={m.avatarUrl}>
                {initials(m.name)}
              </Avatar>
            ))}
          </AvatarGroup>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          <Search
            open={open}
            fetchUsers={fetchUsers}
            members={members}
            onAddMember={handleAdd}
          />
          <MembersList members={members} onRemove={handleRemove} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
