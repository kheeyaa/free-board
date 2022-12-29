import { useEffect, useRef } from "react";
import useYLayers from "../../hook/useYLayers";
import { useCanvas } from "../../store/canvas";
import { PositionType } from "../../types/post";
import { useDragSelect } from "../../utils/DragSelectContext";
import Line, { LineProps } from "./Lines/Line";
import Post, { PostProps } from "./Post/Post";

export type LayerProps = {
  id: string;
  layerInfo: LineProps | PostProps;
  position: PositionType;
};

export default function LayerComponent({
  id,
  layerInfo,
  position,
}: LayerProps) {
  const { canvas, setCanvas } = useCanvas();

  const { bringLayerFront } = useYLayers();

  if (!layerInfo) return null;

  switch (layerInfo.type) {
    case "LINE":
      return (
        <Line
          type={layerInfo.type}
          id={id}
          position={position}
          lineInfo={{
            ...layerInfo.lineInfo,
            isAnimated: canvas.mode !== "TRANSLATING",
          }}
        />
      );
    case "POST":
      return (
        <Post
          type={layerInfo.type}
          id={id}
          position={position}
          postInfo={{
            ...layerInfo.postInfo,
            isAnimated: canvas.mode !== "TRANSLATING",
          }}
        />
      );
    default:
      return null;
  }
}
