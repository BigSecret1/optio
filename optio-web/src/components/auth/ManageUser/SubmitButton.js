import React from "react";

import { Button } from "@mui/material";

import TOKENS from "./utils";

export default function SubmitButton({
  disabled,
  submitting,
  processText = "",
  actionText = "",
}) {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={disabled}
      sx={{
        px: 3,
        py: 1.0,
        mt: 1,
        fontWeight: 700,
        textTransform: "none",
        bgcolor: TOKENS.accent,
        whiteSpace: "nowrap",
        width: "fit-content",
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
