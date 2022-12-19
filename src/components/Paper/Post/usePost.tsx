import { useMode } from "../../../store/mode";
import { v4 as uuidv4 } from "uuid";
import { POST } from "../../../types/post";
import { useLayers } from "../../../store/layers";
import { useDrop } from "react-dnd";

export default function usePost() {
  const { mode, setMode } = useMode();

  const {
    layers,
    setLayer,
    findLayer,
    bringLayerFront,
    bringLayerBack,
    sendLayerStep,
    addLayer,
    removeLayer,
  } = useLayers();

  const setPost = (post: POST) => {
    if (!post.id) return;

    setLayer({
      id: post.id,
      layerInfo: {
        type: "POST",
        id: post.id,
        postInfo: post,
      },
    });
  };

  const movePost = (id: string, left: number, top: number) => {
    const [layer] = findLayer(id);
    if (layer.layerInfo.type !== "POST") return;

    setPost({
      ...layer.layerInfo.postInfo,
      position: {
        x: left,
        y: top,
      },
    });
  };

  const [, dropRef] = useDrop(
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
      userId: "testUserId",
      style: {
        color: "black",
        background: "yello",
      },
    };

    addLayer({
      id,
      layerInfo: { id, type: "POST", postInfo: newPost },
    });
    setPost(newPost);
    setMode("NONE");
  };

  return {
    dropRef,
    handleAddPost,
  };
}
