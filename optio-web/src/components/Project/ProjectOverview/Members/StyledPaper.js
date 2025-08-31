import React from "react";
import { Popper } from "@mui/material";

const StyledPopper = React.forwardRef(function StyledPopper(props, ref) {
  return (
    <Popper
      {...props}
      ref={ref}
      placement="bottom-start"
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
    />
  );
});

export default StyledPopper;
