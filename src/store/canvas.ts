import create from "zustand";

type canvasType = {
  position: {
    x: number;
    y: number;
  };
};

type createCanvas = {
  canvas: canvasType;
  setCanvas: (newCanvas: canvasType) => void;
};

export const useCanvas = create<createCanvas>((set) => ({
  canvas: {
    position: {
      x: 150,
      y: 80,
    },
  },
  setCanvas: (newCanvas) => set((canvas) => ({ ...canvas, newCanvas })),
}));
