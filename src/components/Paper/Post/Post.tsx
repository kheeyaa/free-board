import { forwardRef, useState } from "react";
import { POST } from "../../../types/post";
import { useMode } from "../../../store/mode";
import { useLayers } from "../../../store/layers";

export type PostProps = {
  id: string;
  type: "POST";
  postInfo: POST;
};

const Post = forwardRef(
  ({ id, type = "POST", postInfo }: PostProps, forwardRef: any) => {
    const { mode, setMode } = useMode();
    const [contents, setContents] = useState(postInfo.contents);
    const { setLayer } = useLayers();

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContents(e.target.value);
      setLayer({
        id,
        layerInfo: {
          type: "POST",
          id,
          postInfo: {
            ...postInfo,
            contents: e.target.value,
          },
        },
      });
    };

    return (
      <div
        ref={forwardRef}
        className="absolute bg-yellow-200 shadow-md "
        style={{ left: postInfo.position.x, top: postInfo.position.y }}
        data-id={id}
      >
        <textarea
          placeholder="내용을 입력하세요."
          onChange={onChange}
          className="p-5 bg-transparent focus:outline-none placeholder:italic placeholder-gray-500 placeholder-opacity-20"
          style={{ width: postInfo.width, height: postInfo.height }}
          value={contents}
          disabled={!(mode === "NONE" || mode === "SELECTION")}
        />
      </div>
    );
  }
);
export default Post;
