import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Paper from "./components/Paper/Paper";
import Toolbar from "./components/Toolbar/Toolbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Paper />
        <Toolbar />
      </DndProvider>
    </div>
  );
}

export default App;
