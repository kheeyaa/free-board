import * as Y from "yjs";
import { useEffect, useState } from "react";
import { LayerProps } from "../components/Paper/LayerComponent";
import { doc, yLayers } from "../yjs/yLayers";
import { useMode } from "../store/mode";

type layerUtilTypes = {
  layers: LayerProps[];
  setLayer: (layer: LayerProps) => void;
  addLayer: (layer: LayerProps) => void;
  findLayer: (id: string) => [Y.Map<any>, number];
  removeLayer: (id: string) => void;
  bringLayerFront: (id: string) => void;
  bringLayerBack: (id: string) => void;
  sendLayerStep: (id: string, step: number) => void;
};

export default function useYLayers(): layerUtilTypes {
  const [layers, setLayers] = useState<LayerProps[]>([]);
  const { mode, setMode } = useMode();

  const handleChange = () => {
    const yLayerArr = yLayers.toArray();
    const layers = yLayerArr.map((yLayer) => {
      return {
        id: yLayer.get("id"),
        layerInfo: yLayer.get("layerInfo"),
        position: yLayer.get("position"),
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
    if (mode === "CLEAR") {
      yLayers.delete(0, yLayers.length);
      setMode("NONE");
    }
  }, [mode]);

  const addLayer = (layer: LayerProps) => {
    const yLayer = new Y.Map();

    doc.transact(() => {
      yLayer.set("id", layer.id);
      yLayer.set("position", layer.position);
      yLayer.set("layerInfo", layer.layerInfo);
    });

    yLayers.push([yLayer]);
  };

  const findLayer = (id: string): [Y.Map<any>, number] => {
    let idx = -1;
    layers.filter((layer, index) => {
      if (layer && layer.id === id) {
        idx = index;
        return true;
      }
    })[0];

    return [yLayers.get(idx), idx];
  };

  const setLayer = (newLayer: LayerProps) => {
    if (!newLayer || !newLayer.id) return;
    const [yLayer, idx] = findLayer(newLayer.id);

    if (!yLayer || idx === -1) return;

    doc.transact(() => {
      yLayer.set("id", newLayer.id);
      yLayer.set("position", newLayer.position);
      yLayer.set("layerInfo", newLayer.layerInfo);
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

    yLayers.delete(idx);
    yLayers.push([yLayer]);
  };

  const bringLayerBack = (id: string) => {
    const [yLayer, idx] = findLayer(id);
    if (!yLayer) return;

    yLayers.delete(idx);
    yLayers.insert(idx, [yLayer]);
  };

  const sendLayerStep = (id: string, step: number = 1) => {
    const [yLayer, idx] = findLayer(id);
    if (!yLayer || !step) return;

    const newIdx = idx - step;
    yLayers.delete(idx);
    yLayers.insert(newIdx, [yLayer]);
  };

  return {
    layers,
    addLayer,
    findLayer,
    setLayer,
    removeLayer,
    bringLayerFront,
    bringLayerBack,
    sendLayerStep,
  };
}
