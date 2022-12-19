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
  const { mode } = useMode();

  const { bringLayerFront } = useLayers();

  useEffect(() => {
    const element = selectableElement.current as unknown as HTMLElement;
    if (!element || !ds) return;
    ds.addSelectables(element);
  }, [ds, selectableElement, mode]);

  useEffect(() => {
    if (!ds) return;

    const id = ds.subscribe(
      "callback",
      (e: { items: HTMLElement[]; isDraging: boolean; event: Event }) => {
        const { items } = e;

        items.forEach((layer) => {
          if (!layer) return;
          layer.style.zIndex = "1";
          console.log(layer.style.zIndex);
          const { id: selectId } = layer.dataset;
          if (selectId) bringLayerFront(selectId);
        });
      }
    );

    return () => {
      ds.unsubscribe("callback", undefined, id);
    };
  }, []);

  switch (layerInfo.type) {
    case "LINE":
      return (
        <Line
          ref={selectableElement}
          type={layerInfo.type}
          id={id}
          lineInfo={layerInfo.lineInfo}
        />
      );
    case "POST":
      return (
        <Post
          ref={selectableElement}
          type={layerInfo.type}
          id={id}
          postInfo={layerInfo.postInfo}
        />
      );
    default:
      return null;
  }
}
