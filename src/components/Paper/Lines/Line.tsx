import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "../../../utils/getSvgPathFromStroke";

export type Point = [number, number, number];

export type LineProps = {
  id: string;
  type: "LINE";
  points: Point[];
  style: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

const options = {
  size: 10,
  thinning: 0.6,
  streamline: 0.6,
  smoothing: 0.8,
};

export default function Line({ type = "LINE", id, style, points }: LineProps) {
  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

  return (
    <svg
      data-id={id}
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
}
