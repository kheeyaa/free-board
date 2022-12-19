import { useState } from "react";
import { POST } from "../../../types/post";
import { useDrag } from "react-dnd";
import type { DragSourceMonitor } from "react-dnd";
import { useMode } from "../../../store/mode";

type PostProps = {
  postInfo: POST;
  setPost?: (post: POST) => void;
};

export default function Post({ postInfo, setPost }: PostProps) {
  const { mode, setMode } = useMode();
  const [contents, setContents] = useState(postInfo.contents);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContents(e.target.value);
    setPost &&
      setPost({
        ...postInfo,
        contents: e.target.value,
      });
  };

  const [{ isDragging }, drag] = useDrag(() => {
    return {
      type: "POST",
      item: postInfo,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: mode === "NONE" || mode === "SELECTION",
    };
  }, [postInfo, mode]);

  if (isDragging) return <></>;

  return (
    <div
      className="absolute bg-yellow-200 shadow-md "
      style={{ left: postInfo.position.x, top: postInfo.position.y }}
      ref={drag}
    >
      <textarea
        placeholder="내용을 입력하세요."
        onChange={onChange}
        className="p-5 bg-transparent focus:outline-none placeholder:italic placeholder-gray-500 placeholder-opacity-20"
        style={{ width: postInfo.width, height: postInfo.height }}
        value={contents}
      />
    </div>
  );
}
