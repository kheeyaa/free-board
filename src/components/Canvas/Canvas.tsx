import useLines from "./Lines/useLines";
import LayerComponent from "./LayerComponent";
import usePost from "./Post/usePost";
import { useCanvas } from "@/store/canvas";
import useYLayers from "@/hook/useYLayers";
import { PositionType } from "@/types/post";

export default function Canvas() {
  const { canvas, setCanvas } = useCanvas();

  const { layers } = useYLayers();
  const { handleAddPost } = usePost();

  const startMultiSelection = (current: PositionType, origin: PositionType) => {
    setCanvas({
      mode: "SELECTION_NET",
      origin,
      current,
    });
  };

  const translateSelectedLayers = (current: PositionType) => {
    if (canvas.mode !== "TRANSLATING") {
      return;
    }

    const offset = {
      x: current.x - canvas.current.x,
      y: current.y - canvas.current.y,
    };

    // const liveLayers = storage.get("layers");
    // for (const id of self.presence.selection) {
    //   const layer = liveLayers.get(id);
    //   if (layer) {
    //     layer.update({
    //       x: layer.get("x") + offset.x,
    //       y: layer.get("y") + offset.y,
    //     });
    //   }
    // }

    setCanvas({ mode: "TRANSLATING", current });
  };

  const onPointerDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    handleAddPost(e);
    if (
      canvas.mode === "PENCIL" ||
      canvas.mode === "INSERTING" ||
      canvas.mode === "POST"
    )
      return;

    // setCanvas({
    //   mode: "PRESSING",
    //   origin: {
    //     x: e.clientX,
    //     y: e.clientY,
    //   },
    // });
    // console.log("PRESSING", {
    //   x: e.clientX,
    //   y: e.clientY,
    // });
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const current = {
      x: e.clientX,
      y: e.clientY,
    };

    if (canvas.mode === "PRESSING") {
      startMultiSelection(current, canvas.origin);
    }
  };

  const {
    handleLinesPointerDown,
    handleLinesPointerMove,
    handleLinesPointerUp,
    DrawingLine,
  } = useLines();

  return (
    <>
      <div className="relative w-full h-[2000px] overflow-hidden touch-none">
        <div
          onClick={handleAddPost}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          className="bg-white shadow-md w-full h-[2000px]"
        >
          {layers.map((layer) =>
            layer.type === "POST" ? (
              <LayerComponent
                key={layer.id}
                id={layer.id}
                type={layer.type}
                position={layer.position}
                postInfo={layer.postInfo}
              />
            ) : (
              <LayerComponent
                key={layer.id}
                id={layer.id}
                type={layer.type}
                position={layer.position}
                lineInfo={layer.lineInfo}
              />
            )
          )}

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
    </>
  );
}
