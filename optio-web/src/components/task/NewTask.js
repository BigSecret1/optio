import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

import { TASK_STATUS } from "../../constants";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e6edf3",
    "& fieldset": { borderColor: "#90caf9" },
    "&:hover fieldset": { borderColor: "#64b5f6" },
    "&.Mui-focused fieldset": { borderColor: "#2196f3" },
  },
};

const labelTopSx = {
  color: "white",
  mb: 0.75,
  "&.Mui-focused": { color: "#2196f3" },
};

const selectSx = {
  color: "#e6edf3",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#90caf9" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#64b5f6" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2196f3",
  },
};

export default function NewTask({
  project = 2,
  onSubmit,
  onClose,
  open,
  parentTaskId,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(TASK_STATUS[0]);

  function handleSubmit() {
    onSubmit({
      title,
      description,
      status,
      project,
      parentTask: parentTaskId ?? null,
    });
  }

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: (e) => {
          e.preventDefault();
          handleSubmit();
        },
        sx: {
          borderRadius: 3,
          bgcolor: "#243754",
          color: "#e6edf3",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          maxWidth: 600,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: { xs: 22, sm: 26 },
          color: "#ffffff",
          pb: 1,
        }}
      >
        Create Task
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          {/* Title */}
          <FormControl fullWidth>
            <FormLabel htmlFor="task-title" sx={labelTopSx}>
              Title
            </FormLabel>
            <TextField
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
              sx={fieldSx}
              InputLabelProps={{ shrink: false }}
            />
          </FormControl>

          {/* Description */}
          <FormControl fullWidth>
            <FormLabel htmlFor="task-description" sx={labelTopSx}>
              Description
            </FormLabel>
            <TextField
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={5}
              sx={fieldSx}
              InputLabelProps={{ shrink: false }}
            />
          </FormControl>

          {/* Status */}
          <FormControl fullWidth>
            <FormLabel id="status-label" sx={labelTopSx}>
              Status
            </FormLabel>
            <Select
              aria-labelledby="status-label"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={selectSx}
              displayEmpty
              inputProps={{ id: "task-status" }}
            >
              {TASK_STATUS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {/* Cancel button - subtle */}
        <Button
          onClick={onClose}
          sx={{
            color: "#c5d1e0",
            "&:hover": { color: "#ffffff" },
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "#60A5FA",
            "&:hover": { bgcolor: "#1e40af" },
            fontWeight: 700,
            fontSize: "1rem", // e.g., 16px
            borderRadius: 2,
            px: 3,
            color: "#002027",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
