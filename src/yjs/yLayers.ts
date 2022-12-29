import * as Y from "yjs";
import { updateYDoc } from "../firebase/yLayers";

const roomId = 1;

export const doc = new Y.Doc();

doc.on("update", (update, origin, doc, transaction) => {
  console.log({ update, origin, doc, transaction });
  updateYDoc(update);
});

export const yLayers: Y.Array<Y.Map<any>> = doc.getArray(`layers-${roomId}`);

export const undoManager = new Y.UndoManager(yLayers);
