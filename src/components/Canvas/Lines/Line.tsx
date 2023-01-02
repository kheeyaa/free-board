import { PositionType } from "@/types/post";
import { getSvgPathFromStroke } from "@/utils/getSvgPathFromStroke";
import { getStroke } from "perfect-freehand";

export type Point = [number, number, number];

export type LineTypes = {
  points: Point[];
  isAnimated?: boolean;
  style: {
    width: number;
    height: number;
  };
};

export type LineProps = {
  id: string;
  type: "LINE";
  position: PositionType;
  lineInfo: LineTypes;
};

const options = {
  size: 10,
  thinning: 0,
  streamline: 0.6,
  smoothing: 0.8,
};

const Line = ({
  type = "LINE",
  id,
  position,
  lineInfo: { style, points, isAnimated = false },
}: LineProps) => {
  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

  return (
    <svg
      data-id={id}
      viewBox={`-10 -10 ${style.width} ${style.height}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: style.width + "px",
        height: style.height + "px",
        transition: isAnimated ? "transform 120ms linear" : "",
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <g>
        <path d={pathData} />
      </g>
    </svg>
  );
};

export default Line;
