import Line, { LineProps } from "./Lines/Line";
import Post, { PostProps } from "./Post/Post";

export type LayerProps = {
  id: string;
  layerInfo: LineProps | PostProps;
};

// TODO. layerInfo 를 state 로 관리해야 변경사항을 감지할 수 있음!!
// id 만 넘겨주고 전역 store에서 layerInfo 를 id로 찾아 꺼내오도록 해야함.
export default function LayerComponent({ id, layerInfo }: LayerProps) {
  switch (layerInfo.type) {
    case "LINE":
      return (
        <Line
          type={layerInfo.type}
          id={id}
          style={layerInfo.style}
          points={layerInfo.points}
        />
      );
    case "POST":
      return (
        <Post type={layerInfo.type} id={id} postInfo={layerInfo.postInfo} />
      );
    default:
      return <></>;
  }
}
