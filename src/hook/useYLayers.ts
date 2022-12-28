import { useEffect, useState } from "react";
import { LayerProps } from "../components/Paper/LayerComponent";
import { yLayers } from "../yjs/layers";

type layerUtilTypes = {
  layers: LayerProps[];
  setLayer: (layer: LayerProps) => void;
  addLayer: (layer: LayerProps) => void;
  findLayer: (id: string) => [LayerProps, number];
  removeLayer: (id: string) => void;
  bringLayerFront: (id: string) => void;
  bringLayerBack: (id: string) => void;
  sendLayerStep: (id: string, step: number) => void;
};

export default function useYLayers(): layerUtilTypes {
  const [layers, setLayers] = useState<LayerProps[]>([]);

  const handleChange = () => {
    const layers = yLayers.toArray();
    setLayers(layers);
    // console.log(layers);
  };

  useEffect(() => {
    yLayers.observe(handleChange);

    return () => yLayers.unobserve(handleChange);
  }, []);

  const addLayer = (layer: LayerProps) => {
    yLayers.push([layer]);
  };

  const findLayer = (id: string): [LayerProps, number] => {
    let idx = -1;
    const layers = yLayers.toArray();
    const layer = layers.filter((layer, index) => {
      if (layer && layer.id === id) {
        idx = index;
        return true;
      }
    })[0];
    return [layer, idx];
  };

  const setLayer = (newLayer: LayerProps) => {
    if (!newLayer.id) return;
    const [layer, idx] = findLayer(newLayer.id);

    if (!layer) return;

    yLayers.delete(idx);
    yLayers.insert(idx, [newLayer]);
  };

  const removeLayer = (id: string) => {
    const [layer, idx] = findLayer(id);
    if (!layer) return;

    yLayers.delete(idx);
  };

  const bringLayerFront = (id: string) => {
    const [layer, idx] = findLayer(id);
    if (!layer) return;

    yLayers.delete(idx);
    yLayers.push([layer]);
  };

  const bringLayerBack = (id: string) => {
    const [layer, idx] = findLayer(id);
    if (!layer) return;

    yLayers.delete(idx);
    yLayers.insert(idx, [layer]);
  };

  const sendLayerStep = (id: string, step: number = 1) => {
    const [layer, idx] = findLayer(id);
    if (!layer || !step) return;

    const newIdx = idx - step;
    yLayers.delete(idx);
    yLayers.insert(newIdx, [layer]);
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
