import { useEffect, useState } from "react";
import { useCanvas } from "../../store/canvas";
import { useMode } from "../../store/mode";
import Post from "./Post/Post";
import useLines from "./useLines";
import { useDrop } from "react-dnd";
import { POST, POSTS } from "../../types/post";
import { v4 as uuidv4 } from "uuid";
import useLayer from "./useLayer";

export default function Paper() {
  const { mode, setMode } = useMode();
  const { canvas } = useCanvas();

  const {
    Layers,
    findLayer,
    bringLayerFront,
    bringLayerBack,
    sendLayerStep,
    addLayer,
    removeLayer,
  } = useLayer();

  const [posts, setPosts] = useState<POSTS>();

  const setPost = (post: POST) => {
    setPosts((prev) => ({
      ...prev,
      [post.id]: { ...post },
    }));
  };

  const movePost = (id: string, left: number, top: number) => {
    if (!posts) return;
    const curPost = posts[id];
    setPost({
      ...curPost,
      position: {
        x: left,
        y: top,
      },
    });
  };

  const [, drop] = useDrop(
    () => ({
      accept: "POST",
      drop(item: POST, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        let x = Math.round(item.position.x + delta.x);
        let y = Math.round(item.position.y + delta.y);

        movePost(item.id, x, y);
        bringLayerFront(item.id);
        return;
      },
    }),
    [movePost]
  );

  useEffect(() => {
    switch (mode) {
      case "POST":
        console.log("post");
        break;
      case "PENCIL":
        break;
      case "NONE":
        break;
      default:
    }
  }, [mode]);

  const handleAddPost = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "POST") return;
    const id = uuidv4();
    const newPost = {
      id,
      width: 200,
      height: 200,
      position: {
        x: e.pageX,
        y: e.pageY,
      },
      contents: "",
      createdAt: new Date().toDateString(),
      userId: "test",
      style: {
        color: "black",
        background: "yello",
      },
    };
    setPost(newPost);
    addLayer({
      id,
      Component: () => <Post postInfo={newPost} setPost={setPost} />,
    });
    setMode("NONE");
  };

  const {
    handleLinesPointerDown,
    handleLinesPointerMove,
    handleLinesPointerUp,
    DrawingLine,
  } = useLines({ addLayer });

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    handleLinesPointerDown(e);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    handleLinesPointerMove(e);
  };

  const onPointerUp = () => {
    handleLinesPointerUp();
  };

  return (
    <>
      <div className="relative w-full h-[2000px] bg-gray-50 p-20 px-[150px] pb-0 overflow-hidden">
        <div
          ref={drop}
          onClick={handleAddPost}
          className="bg-white shadow-md w-full h-[2000px]"
        >
          {/* {posts &&
            Object.entries(posts).map(([key, post]) => (
              <Post key={key} postInfo={post} setPost={setPost} />
            ))} */}

          <Layers />

          {mode === "PENCIL" && (
            <svg
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
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
