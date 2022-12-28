import * as Y from "yjs";
import { LayerProps } from "../components/Paper/LayerComponent";

const roomId = 1;

export const doc = new Y.Doc();

doc.on("update", (update, origin, doc, transaction) => {
  console.log({ update, origin, doc, transaction });
});

export const yLayers: Y.Array<LayerProps> = doc.getArray(`layers-${roomId}`);

export const undoManager = new Y.UndoManager(yLayers);
