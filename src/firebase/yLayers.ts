import * as Y from "yjs";
import { getDatabase, ref, set, onChildChanged } from "firebase/database";
import { doc } from "../yjs/yLayers";

export const listenChangedCanvas = () => {
  const db = getDatabase();
  const canvasRef = ref(db, `canvas/1`);
  onChildChanged(canvasRef, (snapshot) => {
    console.log("changed");
    const newDoc = snapshot.val();
    Y.applyUpdate(doc, newDoc);
  });
};

export const updateYDoc = (yDoc: Y.Doc) => {
  const db = getDatabase();
  const canvasRef = ref(db, `canvas/1`);
  set(canvasRef, yDoc);
};
