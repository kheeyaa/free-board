export type PositionType = {
  x: number;
  y: number;
};

export type POST = {
  id: string;
  width: number;
  height: number;
  position: PositionType;
  contents: any;
  createdAt: string;
  userId: string;
  style?: {
    color: string;
    background: string;
  };
};

export type POSTS = {
  [key: string]: POST;
};
