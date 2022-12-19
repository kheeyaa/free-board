import create from "zustand";
import { MODE } from "../types/mode";

type createMode = {
  mode: MODE;
  setMode: (mode: MODE) => void;
};

export const useMode = create<createMode>((set) => ({
  mode: "NONE",
  setMode: (mode) => set({ mode }),
}));
