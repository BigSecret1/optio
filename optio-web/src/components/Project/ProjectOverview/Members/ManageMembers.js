import React, { useCallback, useMemo, useState } from "react";

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
import SelectedMembers from "./SelectedMembers";
import initials from "./utils/initials";
import ApiManager from "../../../../api-client/api-manager";

export default function ManageMembers({
  open,
  onClose,
  onSave,
  fetchUsers,
  title = "Manage members",
}) {
  const [members, setMembers] = useState([]);
  const memberIds = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  function handleAddMember(member) {
    if (member == null || memberIds.has(member.id)) return;
    setMembers([...members, member]);
  }

  const handleRemove = useCallback(
    (userId) => {
      setMembers(members.filter((m) => m.id !== userId));
    },
    [members]
  );

  function handleSave() {
    onSave(members);
    setMembers([]);
    onClose();
  }

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
              <Avatar key={m.id} alt={m.firstName} src={m.avatarUrl}>
                {initials(`${m.firstName} ${m.lastName}`)}
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
            addMember={handleAddMember}
          />
          <SelectedMembers members={members} onRemove={handleRemove} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="cancel" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="save" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
