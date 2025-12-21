import React from "react";
import Button from "@mui/material/Button";

export default function CancelButton({ onClose }) {
  return (
    <Button
      onClick={onClose}
      sx={{
        color: "#c5d1e0",
        "&:hover": { color: "#ffffff" },
      }}
    >
      Cancel
    </Button>
  );
}
