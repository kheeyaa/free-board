import { useState } from "react";
import { useMode } from "../../store/mode";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../../utils/getSvgPathFromStroke";
import { useCanvas } from "../../store/canvas";
import { v4 as uuidv4 } from "uuid";
import { LayerType } from "./useLayer";

type Point = [number, number, number];

type Line = {
  id: string;
  points: Point[];
  style: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type useLinesProps = {
  addLayer: (layer: LayerType) => void;
};

export default function useLines({ addLayer }: useLinesProps) {
  const { mode } = useMode();

  const [isDrawing, setIsDrawing] = useState(false);
  const [line, setLine] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const options = {
    size: 10,
    thinning: 0.6,
    streamline: 0.6,
    smoothing: 0.8,
  };

  function handleLinesPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (mode !== "PENCIL") return;
    const target = e.target as Element;
    target.setPointerCapture(e.pointerId);

    setLine([[e.pageX, e.pageY, e.pressure]]);

    setIsDrawing(true);
  }

  function handleLinesPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawing || e.buttons !== 1) return;
    setLine([...line, [e.pageX, e.pageY, e.pressure]]);
  }

  function getLineInfo(line: Point[]): Line {
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
      id: uuidv4(),
      points: newLine,
      style: {
        x: minX - 10,
        y: minY - 10,
        width: maxX - minX + 20,
        height: maxY - minY + 20,
      },
    };
  }

  function handleLinesPointerUp() {
    if (!isDrawing) return;
    setIsDrawing(false);

    const newLine = getLineInfo(line);
    const { id, points, style } = newLine;

    addLayer({
      id,
      Component: () => {
        const stroke = getStroke(points, options);
        const pathData = getSvgPathFromStroke(stroke);

        return (
          <svg
            key={id}
            viewBox={`-10 -10 ${style.width} ${style.height}`}
            style={{
              position: "absolute",
              left: style.x + "px",
              top: style.y + "px",
              width: style.width + "px",
              height: style.height + "px",
            }}
          >
            <g>
              <path d={pathData} />
            </g>
          </svg>
        );
      },
    });
    setLines((lines) => [...lines, newLine]);
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
