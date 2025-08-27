import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Button, Stack, Tooltip } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import EditProject from "./EditProject";

function ActionBar({ projectId, onEdit, onManageMembers }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
      <Button
        onClick={onEdit}
        size="medium"
        variant="contained"
        color="secondary"
        startIcon={<EditRoundedIcon />}
      >
        Edit project
      </Button>
      <Button
        onClick={onManageMembers}
        size="medium"
        variant="outlined"
        color="inherit"
        startIcon={<GroupRoundedIcon />}
      >
        Manage Members
      </Button>
      <Tooltip title="Go to tasks">
        <Button
          component={RouterLink}
          to={`/projects/${projectId}/tasks`}
          endIcon={<ArrowForwardRoundedIcon />}
          color="inherit"
        >
          SEE TASKS
        </Button>
      </Tooltip>
    </Stack>
  );
}

export default ActionBar;
