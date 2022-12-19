import create from "zustand";
import { LayerProps } from "../components/Paper/LayerComponent";

type createLayers = {
  layers: LayerProps[];
  setLayer: (layer: LayerProps) => void;
  addLayer: (layer: LayerProps) => void;
  findLayer: (id: string) => [LayerProps, number];
  removeLayer: (id: string) => void;
  bringLayerFront: (id: string) => void;
  bringLayerBack: (id: string) => void;
  sendLayerStep: (id: string, step: number) => void;
};

export const useLayers = create<createLayers>((set, get) => ({
  layers: [],

  setLayer: (newLayer) => {
    const { findLayer } = get();
    if (!newLayer.id) return;
    const [layer, idx] = findLayer(newLayer.id);

    if (!layer) return;

    set((prev) => {
      const { layers } = prev;
      const front = layers.slice(0, idx);
      const back = layers.slice(idx + 1);

      return {
        ...prev,
        layers: [...front, newLayer, ...back],
      };
    });
  },

  addLayer: (layer) =>
    set((prev) => ({ ...prev, layers: [...prev.layers, layer] })),

  findLayer: (id: string) => {
    let idx = -1;
    const { layers } = get();
    const layer = layers.filter((layer, index) => {
      if (layer.id === id) {
        idx = index;
        return true;
      }
    })[0];
    return [layer, idx];
  },

  removeLayer: (id: string) => {
    const { findLayer } = get();
    const [layer, idx] = findLayer(id);
    if (!layer) return;

    set((prev) => {
      const { layers } = prev;
      const front = layers.slice(0, idx);
      const back = layers.slice(idx + 1);
      return {
        ...prev,
        layers: [...front, ...back],
      };
    });
  },

  bringLayerFront: (id: string) => {
    const { findLayer } = get();
    const [layer, idx] = findLayer(id);
    if (!layer) return;

    set((prev) => {
      const { layers } = prev;
      const front = layers.slice(0, idx);
      const back = layers.slice(idx + 1);
      return {
        ...prev,
        layers: [...front, ...back, layer],
      };
    });
  },

  bringLayerBack: (id: string) => {
    const { findLayer } = get();
    const [layer, idx] = findLayer(id);
    if (!layer) return;

    set((prev) => {
      const { layers } = prev;
      const front = layers.slice(0, idx);
      const back = layers.slice(0, idx);
      return {
        ...prev,
        layers: [layer, ...front, ...back],
      };
    });
  },

  sendLayerStep: (id: string, step: number = 1) => {
    const { findLayer } = get();
    const [layer, idx] = findLayer(id);
    if (!layer || !step) return;

    set((prev) => {
      const { layers } = prev;
      const newIdx = idx - step;
      if (newIdx < 0 || newIdx >= layers.length) return prev;

      const front = layers.slice(0, idx);
      const back = layers.slice(idx + 1);
      const newLayerList = [...front, ...back];

      return {
        ...prev,
        layers: [
          ...newLayerList.slice(0, newIdx),
          layer,
          ...newLayerList.slice(newIdx + 1),
        ],
      };
    });
  },
}));
