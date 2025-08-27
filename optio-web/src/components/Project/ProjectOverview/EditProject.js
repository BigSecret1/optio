import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  Stack,
} from "@mui/material";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e6edf3",
    "& fieldset": { borderColor: "#90caf9" },
    "&:hover fieldset": { borderColor: "#64b5f6" },
    "&.Mui-focused fieldset": { borderColor: "#2196f3" },
  },
};

const labelTopSx = {
  color: "rgba(230,237,243,0.85)",
  mb: 0.75,
  "&.Mui-focused": { color: "#2196f3" },
};

export default function EditProject({ open, onClose, project, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open && project) {
      setName(project.name || "");
      setDescription(project.description || "");
    }
  }, [open, project]);

  function handleSubmit(e) {
    onSave({ ...project, name, description });
  }

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
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
        Edit Project
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          {/* Project Name */}
          <FormControl fullWidth>
            <FormLabel htmlFor="project-name" sx={labelTopSx}>
              Title *
            </FormLabel>
            <TextField
              id="project-name"
              placeholder="Enter a clear, concise title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
              sx={fieldSx}
              InputLabelProps={{ shrink: false }}
            />
          </FormControl>

          {/* Description */}
          <FormControl fullWidth>
            <FormLabel htmlFor="project-description" sx={labelTopSx}>
              Description
            </FormLabel>
            <TextField
              id="project-description"
              placeholder="Add project description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={5}
              sx={fieldSx}
              InputLabelProps={{ shrink: false }}
            />
          </FormControl>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
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
            bgcolor: "#304971",
            "&:hover": { bgcolor: "#1e40af" },
            fontWeight: 700,
            fontSize: "1rem",
            borderRadius: 2,
            px: 3,
            color: "#ffffff",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
