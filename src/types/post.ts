export type POST = {
  id: string;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
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
