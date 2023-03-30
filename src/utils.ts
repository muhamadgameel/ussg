interface INeighbourCell {
  x: number;
  y: number;
  location: "top" | "bottom" | "left" | "right";
}

export const getNeighbourCells = (
  x: number,
  y: number,
  w: number,
  h: number
): INeighbourCell[] => {
  const arr: INeighbourCell[] = [];

  for (let i = 0; i < w; i++) {
    // top
    arr.push({ x: x + i, y: y - 1, location: "top" });

    // down
    arr.push({ x: x + i, y: y + h, location: "bottom" });
  }

  for (let i = 0; i < h; i++) {
    // left
    arr.push({ x: x - 1, y: y + i, location: "left" });

    // right
    arr.push({ x: x + w, y: y + i, location: "right" });
  }

  return arr;
};

export const getDom = (id: string) => {
  return document.getElementById(id);
};
