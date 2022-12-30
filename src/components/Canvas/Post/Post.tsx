import { forwardRef, useEffect, useState } from "react";
import { PositionType, POST } from "../../../types/post";
import useYLayers from "../../../hook/useYLayers";
import { useCanvas } from "../../../store/canvas";

export type PostProps = {
  id: string;
  type: "POST";
  position: PositionType;
  postInfo: POST;
};

const Post = forwardRef(
  ({ id, type = "POST", position, postInfo }: PostProps, forwardRef: any) => {
    const { canvas } = useCanvas();
    const [contents, setContents] = useState(postInfo.contents);
    const { setLayer } = useYLayers();

    useEffect(() => {
      if (postInfo) setContents(postInfo.contents);
    }, [postInfo.contents]);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContents(e.target.value);
      setLayer({
        id,
        type: "POST",
        postInfo: {
          contents: e.target.value,
        },
      });
    };

    return (
      <div
        ref={forwardRef}
        className="absolute bg-yellow-200 shadow-md top-0 left-0"
        style={{
          transition: postInfo.isAnimated ? "transform 50ms linear" : "",
          transform: `translate(${position?.x || 0}px, ${position?.y || 0}px)`,
        }}
        data-id={id}
      >
        <textarea
          placeholder="내용을 입력하세요."
          onChange={onChange}
          className="p-5 bg-transparent focus:outline-none placeholder:italic placeholder-gray-500 placeholder-opacity-20"
          style={{ width: postInfo.width, height: postInfo.height }}
          value={contents}
          disabled={!(canvas.mode === "NONE" || canvas.mode === "SELECTION")}
        />
      </div>
    );
  }
);
export default Post;
