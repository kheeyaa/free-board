import React, { createContext, useState, useEffect, useContext } from "react";
import DragSelect from "dragselect";
import { useCanvas } from "@/store/canvas";

type ProviderProps = {
  children: React.ReactNode;
  settings?: ConstructorParameters<typeof DragSelect>[0];
};

const Context = createContext<DragSelect | undefined>(undefined);

function DragSelectProvider({ children, settings = {} }: ProviderProps) {
  const [ds, setDS] = useState<DragSelect>();
  const { canvas } = useCanvas();

  useEffect(() => {
    switch (canvas.mode) {
      case "POST":
      case "PENCIL":
        ds?.start();
        ds?.stop();
        break;
      case "SELECTION":
      case "NONE":
        ds?.start();
        break;
      case "CLEAR":
      case "TRANSLATING":
        break;
      default:
        console.warn(`${canvas.mode}는 사용할 수 없는 모드입니다.`);
        ds?.start();
    }
  }, [canvas.mode, ds]);

  useEffect(() => {
    setDS((prevState) => {
      if (prevState) return prevState;
      return new DragSelect({});
    });

    return () => {
      if (ds) {
        ds.stop();
        setDS(undefined);
      }
    };
  }, [ds]);

  useEffect(() => {
    ds?.setSettings(settings);
  }, [ds, settings]);

  return <Context.Provider value={ds}>{children}</Context.Provider>;
}

function useDragSelect() {
  return useContext(Context);
}

export { DragSelectProvider, useDragSelect };
