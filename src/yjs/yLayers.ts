import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const roomId = 1;

export const doc = new Y.Doc();

export const provider = new WebsocketProvider(
  "ws://localhost:1234",
  `canvas-${roomId}`,
  doc
);

export const awareness = provider.awareness;

provider.on("status", (event: any) => {
  console.log(event.status); // logs "connected" or "disconnected"
});

export const yLayers: Y.Array<Y.Map<any>> = doc.getArray(`layers-${roomId}`);

export const undoManager = new Y.UndoManager(yLayers);
