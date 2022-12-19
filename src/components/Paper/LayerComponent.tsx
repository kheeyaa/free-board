import Line, { LineProps } from "./Lines/Line";
import Post, { PostProps } from "./Post/Post";

export type LayerProps = {
  id: string;
  layerInfo: LineProps | PostProps;
};

export default function LayerComponent({ id, layerInfo }: LayerProps) {
  switch (layerInfo.type) {
    case "LINE":
      return (
        <Line type={layerInfo.type} id={id} lineInfo={layerInfo.lineInfo} />
      );
    case "POST":
      return (
        <Post type={layerInfo.type} id={id} postInfo={layerInfo.postInfo} />
      );
    default:
      return <></>;
  }
}
