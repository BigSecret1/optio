import React from "react";
import { Button } from "@mui/material";
import TOKENS from "./utils";

export default function SubmitButton({
  disabled,
  submitting = false,
  processText = "",
  actionText = "",
}) {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={disabled}
      sx={{
        py: 1,
        px: 3,
        fontWeight: 600,
        fontSize: "0.9rem",
        textTransform: "none",
        whiteSpace: "nowrap",
        width: "fit-content",
        lineHeight: 1.2,
        bgcolor: TOKENS.accent,
        color: "#002027",
        "&:hover": { bgcolor: "#3fb0ff" },
        "&.Mui-disabled": {
          bgcolor: TOKENS.disabledBtnBg,
          color: "rgba(0,20,30,0.5)",
        },
      }}
    >
      {submitting ? processText : actionText}
    </Button>
  );
}
