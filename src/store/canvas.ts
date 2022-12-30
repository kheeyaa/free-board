import { PositionType } from "@/types/post";
import create from "zustand";

type canvasType =
  | {
      mode: "PENCIL";
    }
  | {
      mode: "POST";
    }
  | {
      mode: "NONE";
    }
  | {
      mode: "ERASE";
    }
  | {
      mode: "CLEAR";
      preCanvas: canvasType;
    }
  | {
      mode: "SELECTION";
    }
  | {
      mode: "SELECTION_NET";
      origin: PositionType;
      current?: PositionType;
    }
  | {
      mode: "TRANSLATING";
      current: PositionType;
    }
  | {
      mode: "PRESSING";
      origin: PositionType;
    }
  | {
      mode: "INSERTING";
    }
  | {
      mode: "RESIZING";
    };

export type CanvasMode = canvasType["mode"];

type createCanvas = {
  canvas: canvasType;
  setCanvas: (newCanvas: canvasType) => void;
};

export const useCanvas = create<createCanvas>((set) => ({
  canvas: {
    mode: "NONE",
  },
  setCanvas: (canvas) => set({ canvas }),
}));
