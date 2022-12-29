import { useEffect } from "react";
import { useMode } from "../../store/mode";
import { MODE } from "../../types/mode";
import ClearButton from "./Button/ClearButton";
import PencilButton from "./Button/PencilButton";
import PostButton from "./Button/PostButton";
import SelectionButton from "./Button/SelectionButton";

export default function Toolbar() {
  const { mode, setMode } = useMode();

  return (
    <div className="fixed top-20 left-10 w-20 bg-white shadow-md p-10 rounded-full flex flex-col gap-3 items-center">
      <PostButton
        isActive={mode === "POST"}
        onClick={() => {
          setMode("POST");
        }}
      />
      <PencilButton
        isActive={mode === "PENCIL"}
        onClick={() => {
          setMode("PENCIL");
        }}
      />
      <SelectionButton
        isActive={mode === "SELECTION"}
        onClick={() => {
          setMode("SELECTION");
        }}
      />
      <ClearButton
        isActive={mode === "CLEAR"}
        onClick={() => {
          setMode("CLEAR");
        }}
      />
    </div>
  );
}
