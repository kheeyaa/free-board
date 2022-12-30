import * as Y from "yjs";
import { useEffect, useState } from "react";
import { LayerProps } from "../components/Paper/LayerComponent";
import { doc, provider, yLayers } from "../yjs/yLayers";
import { useCanvas } from "../store/canvas";
import deepUpdate from "../utils/deepUpdate";
import { DeepPartial } from "../types/DeepPartial";

type layerUtilTypes = {
  isLoading: boolean;
  layers: LayerProps[];
  setLayer: (
    layer: DeepPartial<LayerProps> & { type: string; id: string }
  ) => void;
  addLayer: (layer: LayerProps) => void;
  removeLayer: (id: string) => void;
  bringLayerFront: (id: string) => void;
  bringLayerBack: (id: string) => void;
  sendLayerStep: (id: string, step: number) => void;
};

export default function useYLayers(): layerUtilTypes {
  const [isLoading, setIsLoading] = useState(true);
  const [layers, setLayers] = useState<LayerProps[]>([]);

  const { canvas, setCanvas } = useCanvas();

  provider.on("sync", (isSynced: boolean) => {
    setIsLoading(!isSynced);
  });

  const handleChange = () => {
    const yLayerArr = yLayers.toArray();
    const layers = yLayerArr.map((yLayer): LayerProps => {
      const layer = {
        id: yLayer.get("id"),
        type: yLayer.get("type"),
        position: yLayer.get("position"),
      };

      if (layer.type === "POST")
        return {
          ...layer,
          postInfo: yLayer.get("postInfo"),
        };
      else
        return {
          ...layer,
          lineInfo: yLayer.get("lineInfo"),
        };
    });

    setLayers(layers);
  };

  doc.on("update", (update, origin, doc, transaction) => {
    handleChange();
  });

  useEffect(() => {
    handleChange();
    yLayers.observe(handleChange);

    return () => yLayers.unobserve(handleChange);
  }, []);

  useEffect(() => {
    if (canvas.mode === "CLEAR") {
      yLayers.delete(0, yLayers.length);
      setCanvas(canvas.preCanvas);
    }
  }, [canvas.mode]);

  const addLayer = (layer: LayerProps) => {
    const yLayer = new Y.Map();

    doc.transact(() => {
      yLayer.set("id", layer.id);
      yLayer.set("type", layer.type);
      yLayer.set("position", layer.position);
      if (layer.type === "POST") yLayer.set("postInfo", layer.postInfo);
      if (layer.type === "LINE") yLayer.set("lineInfo", layer.lineInfo);
    });

    yLayers.push([yLayer]);
  };

  const findLayer = (id: string): [Y.Map<any> | null, number] => {
    let idx = -1;
    if (!yLayers) return [null, idx];

    const yLayerArr = yLayers.toArray();
    if (yLayerArr)
      yLayerArr.forEach((yLayer, index) => {
        if (yLayer && yLayer.get("id") === id) {
          idx = index;
        }
      });

    return [yLayers.get(idx), idx];
  };

  const setLayer = (
    updated: DeepPartial<LayerProps> & { type: string; id: string }
  ) => {
    if (!updated || !updated.id) return;
    const [yLayer, idx] = findLayer(updated.id);

    if (!yLayer || idx === -1) return;

    doc.transact(() => {
      yLayer.set("id", updated.id);
      updated?.position && yLayer.set("position", updated.position);

      if (updated.type === "POST" && updated?.postInfo) {
        const postInfo = yLayer.get("postInfo");
        deepUpdate(updated?.postInfo, postInfo);
        yLayer.set("postInfo", postInfo);
      }
      if (updated.type === "LINE" && updated?.lineInfo) {
        const lineInfo = yLayer.get("lineInfo");
        deepUpdate(updated?.lineInfo, lineInfo);
        yLayer.set("lineInfo", lineInfo);
      }
    });
  };

  const removeLayer = (id: string) => {
    const [yLayer, idx] = findLayer(id);
    if (!yLayer || idx === -1) return;

    yLayers.delete(idx);
  };

  const bringLayerFront = (id: string) => {
    const [yLayer, idx] = findLayer(id);
    if (!yLayer) return;

    const cloneYLayer = yLayer.clone();
    yLayers.delete(idx);
    yLayers.push([cloneYLayer]);
  };

  const bringLayerBack = (id: string) => {
    const [yLayer, idx] = findLayer(id);
    if (!yLayer) return;

    const cloneYLayer = yLayer.clone();
    yLayers.delete(idx);
    yLayers.insert(idx, [cloneYLayer]);
  };

  const sendLayerStep = (id: string, step: number = 1) => {
    const [yLayer, idx] = findLayer(id);
    if (!yLayer || !step) return;

    const cloneYLayer = yLayer.clone();
    const newIdx = idx - step;
    yLayers.delete(idx);
    yLayers.insert(newIdx, [cloneYLayer]);
  };

  return {
    isLoading,
    layers,
    addLayer,
    setLayer,
    removeLayer,
    bringLayerFront,
    bringLayerBack,
    sendLayerStep,
  };
}
