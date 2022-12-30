import useYLayers from "../../hook/useYLayers";
import { useCanvas } from "../../store/canvas";
import Line, { LineProps } from "./Lines/Line";
import Post, { PostProps } from "./Post/Post";

export type LayerProps = LineProps | PostProps;

export default function LayerComponent(props: LayerProps) {
  const { id, position, type } = props;
  const { canvas, setCanvas } = useCanvas();

  const { bringLayerFront } = useYLayers();

  if (!type) return null;

  switch (type) {
    case "LINE":
      return (
        <Line
          type={type}
          id={id}
          position={position}
          lineInfo={{
            ...props.lineInfo,
            isAnimated: canvas.mode !== "TRANSLATING",
          }}
        />
      );
    case "POST":
      return (
        <Post
          type={type}
          id={id}
          position={position}
          postInfo={{
            ...props.postInfo,
            isAnimated: canvas.mode !== "TRANSLATING",
          }}
        />
      );
    default:
      return null;
  }
}
