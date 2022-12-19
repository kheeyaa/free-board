import { useEffect, useRef } from "react";
import { useLayers } from "../../store/layers";
import { useMode } from "../../store/mode";
import { useDragSelect } from "../../utils/DragSelectContext";
import Line, { LineProps } from "./Lines/Line";
import Post, { PostProps } from "./Post/Post";

export type LayerProps = {
  id: string;
  layerInfo: LineProps | PostProps;
};

export default function LayerComponent({ id, layerInfo }: LayerProps) {
  const ds = useDragSelect();
  const selectableElement = useRef(null);
  const { mode, setMode } = useMode();

  const { bringLayerFront, setLayer, findLayer } = useLayers();

  useEffect(() => {
    const element = selectableElement.current as unknown as HTMLElement;
    if (!element || !ds) return;
    ds.addSelectables(element);
  }, [ds, selectableElement, mode]);

  useEffect(() => {
    if (!ds) return;

    const callbackId = ds.subscribe(
      "callback",
      (e: { items: HTMLElement[]; isDraging: boolean; event: Event }) => {
        setMode("SELECTION");
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
        setMode("TRANSLATING");

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

  switch (layerInfo.type) {
    case "LINE":
      return (
        <Line
          ref={selectableElement}
          type={layerInfo.type}
          id={id}
          position={layerInfo.position}
          lineInfo={{
            ...layerInfo.lineInfo,
            isAnimated: mode !== "TRANSLATING",
          }}
        />
      );
    case "POST":
      return (
        <Post
          ref={selectableElement}
          type={layerInfo.type}
          id={id}
          position={layerInfo.position}
          postInfo={{
            ...layerInfo.postInfo,
            isAnimated: mode !== "TRANSLATING",
          }}
        />
      );
    default:
      return null;
  }
}
