import React from "react";
import { Button } from "@mui/material";
import TOKENS from "./utils";

export default function SubmitButton({
  disabled,
  submitting = false,
  processText = "",
  actionText = "",
  fullWidth = false,
}) {
  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        py: 1.25,
        mt: 1,
        fontWeight: 700,
        textTransform: "none",
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
