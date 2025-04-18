import React from "react";
import { useEffect, useState, createContext, useContext } from "react";

// matrical UI
import Box from "@mui/material/Box";

// Internal modules
import { TaskContext } from "../../../contexts/TaskContext";
import OptionMenu from "../../UI/OptionMenu.js";

// Child components
import EllipsisWithSpacing from "../../UI/ThreeDots.js";
import EditTaskDescription from "./EditTaskDescription.js";

export default function Description({ taskId }) {
  const {
    task,
    optionToState,
    isEditingTaskDescription,
    setIsEditingTaskDescription,
  } = useContext(TaskContext);

  const menuOptionsForDescription = ["Edit Description"];

  optionToState.set("Edit Description", setIsEditingTaskDescription);

  return (
    <Box
      sx={[
        (theme) => ({
          display: "flex",
          flexDirection: "column",
          m: 1,
          p: 1,
          minHeight: "30vh",
          height: "auto",
          bgcolor: "#304971",
          color: "white",
          border: "0.5px solid",
          borderColor: "#3F5880",
          borderRadius: 2,
          fontSize: "0.875rem",
          fontWeight: "700",
          ...theme.applyStyles("dark", {
            bgcolor: "#101010",
            color: "white",
            // borderColor: 'grey.800',
          }),
        }),
      ]}
    >
      <div className="descriptionHeader">
        <h3>Description</h3>
        <div className="optionMenuEllipsContainer">
          <OptionMenu options={menuOptionsForDescription}>
            <EllipsisWithSpacing containerClass="optionDots" />
          </OptionMenu>
        </div>
      </div>
      {isEditingTaskDescription === true ? (
        <EditTaskDescription taskId={taskId} />
      ) : (
        <p>{task.description}</p>
      )}
    </Box>
  );
}
