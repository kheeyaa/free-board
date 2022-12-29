import { useCanvas } from "../../store/canvas";
import ClearButton from "./Button/ClearButton";
import PencilButton from "./Button/PencilButton";
import PostButton from "./Button/PostButton";
import SelectionButton from "./Button/SelectionButton";

export default function Toolbar() {
  const { canvas, setCanvas } = useCanvas();

  return (
    <div className="fixed z-50 top-20 left-10 w-20 backdrop-blur-sm bg-white/30 shadow-md p-10 rounded-full flex flex-col gap-3 items-center">
      <PostButton
        isActive={canvas.mode === "POST"}
        onClick={() => {
          setCanvas({ mode: "POST" });
        }}
      />
      <PencilButton
        isActive={canvas.mode === "PENCIL"}
        onClick={() => {
          setCanvas({ mode: "PENCIL" });
        }}
      />
      <SelectionButton
        isActive={canvas.mode === "SELECTION"}
        onClick={() => {
          setCanvas({ mode: "SELECTION" });
        }}
      />
      <ClearButton
        isActive={canvas.mode === "CLEAR"}
        onClick={() => {
          setCanvas({ mode: "CLEAR", preCanvas: canvas });
        }}
      />
    </div>
  );
}
