import { useState } from "react";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../../../utils/getSvgPathFromStroke";
import { v4 as uuidv4 } from "uuid";
import { LineProps, Point } from "./Line";
import useYLayers from "../../../hook/useYLayers";
import { useCanvas } from "../../../store/canvas";

export default function useLines() {
  const { addLayer } = useYLayers();

  const { canvas } = useCanvas();

  const [isDrawing, setIsDrawing] = useState(false);
  const [line, setLine] = useState<Point[]>([]);

  const options = {
    size: 10,
    thinning: 0.6,
    streamline: 0.6,
    smoothing: 0.8,
  };

  function handleLinesPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (canvas.mode !== "PENCIL") return;
    const target = e.target as Element;
    target.setPointerCapture(e.pointerId);

    setLine([[e.pageX, e.pageY, e.pressure]]);

    setIsDrawing(true);
  }

  function handleLinesPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawing || e.buttons !== 1) return;
    setLine([...line, [e.pageX, e.pageY, e.pressure]]);
  }

  function getLineInfo(line: Point[]): LineProps {
    const maxX = line.reduce((maxX, [curX]) => (maxX < curX ? curX : maxX), 0);
    const maxY = line.reduce(
      (maxY, [, curY]) => (maxY < curY ? curY : maxY),
      0
    );
    const minX = line.reduce(
      (minX, [curX]) => (minX > curX ? curX : minX),
      100000
    );
    const minY = line.reduce(
      (minY, [, curY]) => (minY > curY ? curY : minY),
      100000
    );
    const newLine = line.map<Point>(([x, y, press]) => [
      x - minX,
      y - minY,
      press,
    ]);

    return {
      type: "LINE",
      id: uuidv4(),
      position: {
        x: minX - 10,
        y: minY - 10,
      },
      lineInfo: {
        points: newLine,
        style: {
          width: maxX - minX + 20,
          height: maxY - minY + 20,
        },
      },
    };
  }

  function handleLinesPointerUp() {
    if (!isDrawing) return;
    setIsDrawing(false);

    const newLine = getLineInfo(line);
    addLayer({
      id: newLine.id,
      layerInfo: newLine,
      position: newLine.position,
    });
    setLine([]);
  }

  const stroke = getStroke(line, options);
  const pathData = getSvgPathFromStroke(stroke);

  const DrawingLine = () => <g>{isDrawing && <path d={pathData} />}</g>;

  return {
    handleLinesPointerDown,
    handleLinesPointerMove,
    handleLinesPointerUp,
    DrawingLine,
  };
}
