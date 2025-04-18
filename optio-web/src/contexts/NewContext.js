import React, { createContext, useState } from "react";

export const NewContext = createContext();

export function NewProvider({ children }) {
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  return (
    <NewContext.Provider
      value={{
        openCreateProject,
        setOpenCreateProject,
        openCreateTask,
        setOpenCreateTask
      }}
    >
      {children}
    </NewContext.Provider>
  );
}
