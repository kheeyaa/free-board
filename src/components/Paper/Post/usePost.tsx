import { v4 as uuidv4 } from "uuid";
import useYLayers from "../../../hook/useYLayers";
import { useCanvas } from "../../../store/canvas";

export default function usePost() {
  const { canvas, setCanvas } = useCanvas();

  const { addLayer } = useYLayers();

  const handleAddPost = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvas.mode !== "POST") return;
    const id = uuidv4();
    const newPost = {
      id,
      width: 200,
      height: 200,
      contents: "",
      createdAt: new Date().toDateString(),
      userId: "testUserId",
      style: {
        color: "black",
        background: "yello",
      },
    };

    addLayer({
      id,
      position: {
        x: e.pageX,
        y: e.pageY,
      },
      layerInfo: {
        id,
        position: {
          x: e.pageX,
          y: e.pageY,
        },
        type: "POST",
        postInfo: newPost,
      },
    });
    setCanvas({ mode: "NONE" });
  };

  return {
    handleAddPost,
  };
}
