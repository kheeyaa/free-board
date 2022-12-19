export type PositionType = {
  x: number;
  y: number;
};

export type POST = {
  id: string;
  width: number;
  height: number;
  contents: any;
  createdAt: string;
  userId: string;
  isAnimated?: boolean;
  style?: {
    color: string;
    background: string;
  };
};

export type POSTS = {
  [key: string]: POST;
};
