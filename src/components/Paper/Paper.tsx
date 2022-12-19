import { useEffect } from "react";
import { useMode } from "../../store/mode";
import useLines from "./Lines/useLines";
import LayerComponent from "./LayerComponent";
import { useLayers } from "../../store/layers";
import usePost from "./Post/usePost";

export default function Paper() {
  const { mode, setMode } = useMode();

  const { layers } = useLayers();

  useEffect(() => {
    switch (mode) {
      case "POST":
        break;
      case "PENCIL":
        break;
      case "NONE":
        break;
      default:
    }
  }, [mode]);

  const { dropRef, handleAddPost } = usePost();

  const {
    handleLinesPointerDown,
    handleLinesPointerMove,
    handleLinesPointerUp,
    DrawingLine,
  } = useLines();

  return (
    <>
      <div className="relative w-full h-[2000px] bg-gray-50 p-20 px-[150px] pb-0 overflow-hidden">
        <div
          ref={dropRef}
          onClick={handleAddPost}
          className="bg-white shadow-md w-full h-[2000px]"
        >
          {layers.map((layer) => (
            <LayerComponent
              key={layer.id}
              id={layer.id}
              layerInfo={layer.layerInfo}
            />
          ))}

          {mode === "PENCIL" && (
            <svg
              onPointerDown={handleLinesPointerDown}
              onPointerMove={handleLinesPointerMove}
              onPointerUp={handleLinesPointerUp}
              style={{ touchAction: "none" }}
              className="absolute top-0 left-0 w-full h-[2000px]"
            >
              <DrawingLine />
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
