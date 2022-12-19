import { useState } from "react";
import { LayerProps } from "./LayerComponent";

export default function useLayer() {
  const [layerList, setLayerList] = useState<LayerProps[]>([]);

  const findLayer = (id: string): [LayerProps, number] => {
    let idx = -1;
    const layer = layerList.filter((layer, index) => {
      if (layer.id === id) {
        idx = index;
        return true;
      }
    })[0];
    return [layer, idx];
  };

  const bringLayerFront = (id: string) => {
    const [layer, idx] = findLayer(id);
    if (!layer) return;
    setLayerList((layerList) => {
      const front = layerList.slice(0, idx);
      const back = layerList.slice(idx + 1);
      return [...front, ...back, layer];
    });
  };

  const bringLayerBack = (id: string) => {
    const [layer, idx] = findLayer(id);
    if (!layer) return;
    setLayerList((layerList) => {
      const front = layerList.slice(0, idx);
      const back = layerList.slice(idx + 1);
      return [layer, ...front, ...back];
    });
  };

  const sendLayerStep = (id: string, step: number = 1) => {
    const [layer, idx] = findLayer(id);
    if (!layer || !step) return;

    setLayerList((layerList) => {
      const newIdx = idx - step;
      if (newIdx < 0 || newIdx >= layerList.length) return layerList;

      const front = layerList.slice(0, idx);
      const back = layerList.slice(idx + 1);
      const newLayerList = [...front, ...back];

      return [
        ...newLayerList.slice(0, newIdx),
        layer,
        ...newLayerList.slice(newIdx + 1),
      ];
    });
  };

  const addLayer = (layer: LayerProps) => {
    setLayerList((prev) => [...prev, layer]);
  };

  const removeLayer = (id: string) => {
    const [layer, idx] = findLayer(id);
    if (!layer) return;
    setLayerList((layerList) => {
      const front = layerList.slice(0, idx);
      const back = layerList.slice(idx + 1);
      return [...front, ...back];
    });
  };

  return {
    layerList,
    findLayer,
    bringLayerFront,
    bringLayerBack,
    sendLayerStep,
    addLayer,
    removeLayer,
  };
}
