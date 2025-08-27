import React from "react";
import { Box } from "@mui/material";

export default function AccentBar() {
  return (
    <Box
      sx={(t) => ({
        height: 3,
        width: "100%",
        background: `linear-gradient(90deg, ${t.palette.primary.light}, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
      })}
    />
  );
}
