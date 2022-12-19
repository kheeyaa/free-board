import { useState } from "react";
import { useMode } from "../../store/mode";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../../utils/getSvgPathFromStroke";
import { useCanvas } from "../../store/canvas";
import { v4 as uuidv4 } from "uuid";
import { POSTS } from "../../types/post";

type Point = [number, number, number];

export default function usePosts() {
  const { mode } = useMode();
  const { canvas } = useCanvas();

  const [posts, setPost] = useState<POSTS>();

  function handlePostsPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (mode !== "POST") return;
  }

  const PostIts = () => <></>;

  return {
    handlePostsPointerDown,
    PostIts,
  };
}
