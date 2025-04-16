import React from "react";

import "./App.css";
import { NewProvider } from "./contexts/NewContext";
import Create from "./components/common/Create";
import NewProject from "./components/project/NewProject";
import NewTask from "./components/task/NewTask";

function App() {
  return (
    <>
      <NewProvider>
        <Create />
        <NewProject />
        <NewTask />
      </NewProvider>
    </>
  );
}

export default App;
