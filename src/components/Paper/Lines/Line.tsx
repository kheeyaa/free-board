import { getStroke } from "perfect-freehand";
import { PositionType } from "../../../types/post";
import { getSvgPathFromStroke } from "../../../utils/getSvgPathFromStroke";

export type Point = [number, number, number];

export type LineTypes = {
  points: Point[];
  position: PositionType;
  style: {
    width: number;
    height: number;
  };
};

export type LineProps = {
  id: string;
  type: "LINE";
  lineInfo: LineTypes;
};

const options = {
  size: 10,
  thinning: 0.6,
  streamline: 0.6,
  smoothing: 0.8,
};

export default function Line({
  type = "LINE",
  id,
  lineInfo: { style, points, position },
}: LineProps) {
  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

  return (
    <svg
      data-id={id}
      viewBox={`-10 -10 ${style.width} ${style.height}`}
      style={{
        position: "absolute",
        left: position.x + "px",
        top: position.y + "px",
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
