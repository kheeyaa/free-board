import useLines from "./Lines/useLines";
import LayerComponent from "./LayerComponent";
import usePost from "./Post/usePost";
import { DragSelectProvider } from "../../utils/DragSelectContext";
import useYLayers from "../../hook/useYLayers";
import { useCanvas } from "../../store/canvas";

export default function Paper() {
  const { canvas } = useCanvas();

  const { layers } = useYLayers();
  const { handleAddPost } = usePost();

  const {
    handleLinesPointerDown,
    handleLinesPointerMove,
    handleLinesPointerUp,
    DrawingLine,
  } = useLines();

  return (
    <>
      <DragSelectProvider>
        <div className="relative w-full h-[2000px] overflow-hidden">
          <div
            onClick={handleAddPost}
            className="bg-white shadow-md w-full h-[2000px]"
          >
            {layers.map((layer) => (
              <LayerComponent
                key={layer.id}
                id={layer.id}
                position={layer.position}
                layerInfo={layer.layerInfo}
              />
            ))}

            {canvas.mode === "PENCIL" && (
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
      </DragSelectProvider>
    </>
  );
}
