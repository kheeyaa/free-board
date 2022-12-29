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
  const ds = useDragSelect();
  const selectableElement = useRef(null);

  const { canvas, setCanvas } = useCanvas();

  const { bringLayerFront } = useYLayers();

  useEffect(() => {
    const element = selectableElement.current as unknown as HTMLElement;
    if (!element || !ds) return;
    ds.addSelectables(element);
  }, [ds, selectableElement, canvas.mode]);

  useEffect(() => {
    if (!ds) return;

    const callbackId = ds.subscribe(
      "callback",
      (e: { items: HTMLElement[]; isDraging: boolean; event: Event }) => {
        setCanvas({ mode: "SELECTION" });
        const { items } = e;

        items.forEach((layer) => {
          if (!layer) return;
          layer.style.zIndex = "1";
          const { id: selectId } = layer.dataset;
          if (selectId) bringLayerFront(selectId);
        });
      }
    );

    const dragmoveId = ds.subscribe(
      "dragmove",
      (e: { items: HTMLElement[]; isDraging: boolean; event: MouseEvent }) => {
        setCanvas({ mode: "TRANSLATING" });

        // const {
        //   items,
        //   event: { clientX, clientY },
        // } = e;
        // items.forEach((layer) => {
        //   if (!layer) return;

        //   const { id: selectId } = layer.dataset;
        //   if (!selectId) return;

        //   setLayer({
        //     id: selectId,
        //     position: {
        //       x: clientX,
        //       y: clientY,
        //     },
        //     layerInfo: {
        //       ...layerInfo,
        //       position: {
        //         x: clientX,
        //         y: clientY,
        //       },
        //     },
        //   });
        // });
      }
    );

    return () => {
      ds.unsubscribe("callback", undefined, callbackId);
      ds.unsubscribe("dragmove", undefined, dragmoveId);
    };
  }, []);

  if (!layerInfo) return null;

  switch (layerInfo.type) {
    case "LINE":
      return (
        <Line
          ref={selectableElement}
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
          ref={selectableElement}
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
