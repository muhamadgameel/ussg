type IRoadDirection =
  | "vertical"
  | "horizontal"
  | "topleft"
  | "topright"
  | "bottomleft"
  | "bottomright"
  | "3wayTop"
  | "3wayBottom"
  | "3wayRight"
  | "3wayLeft"
  | "4way";

interface IRoad {
  x: number;
  y: number;
  width: number;
  height: number;
  network_id: number | null;
  direction: IRoadDirection;
}

interface IRoadProps {
  x: number;
  y: number;
  network_id?: number | null;
  direction?: IRoadDirection;
}

class Road implements IRoad {
  x: number;
  y: number;
  width: number;
  height: number;
  network_id: number | null;
  direction: IRoadDirection;

  constructor({
    x,
    y,
    network_id = null,
    direction = "horizontal",
  }: IRoadProps) {
    this.x = x;
    this.y = y;
    this.network_id = network_id;
    this.width = 1;
    this.height = 1;
    this.direction = direction;
  }

  adjustDirection(
    neighbour_roads: Record<"left" | "right" | "top" | "bottom", boolean>
  ) {
    const { left, right, top, bottom } = neighbour_roads;

    if (left && right && top && bottom) {
      this.direction = "4way";
    } else if (top && right && bottom) {
      this.direction = "3wayRight";
    } else if (left && right && bottom) {
      this.direction = "3wayBottom";
    } else if (left && top && bottom) {
      this.direction = "3wayLeft";
    } else if (left && top && right) {
      this.direction = "3wayTop";
    } else if (bottom && left) {
      this.direction = "topright";
    } else if (bottom && right) {
      this.direction = "topleft";
    } else if (top && right) {
      this.direction = "bottomleft";
    } else if (top && left) {
      this.direction = "bottomright";
    } else if (left && right) {
      this.direction = "horizontal";
    } else if (top && bottom) {
      this.direction = "vertical";
    } else if (top || bottom) {
      this.direction = "vertical";
    } else if (left || right) {
      this.direction = "horizontal";
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellSize: number
  ) {
    const gap = 6;
    ctx.fillStyle = "rgb(255, 255, 0)";

    if (this.direction === "horizontal") {
      ctx.fillRect(
        x,
        y + gap,
        this.width * cellSize,
        this.height * cellSize - gap * 2
      );
    } else if (this.direction === "vertical") {
      ctx.fillRect(
        x + gap,
        y,
        this.width * cellSize - gap * 2,
        this.height * cellSize
      );
    } else if (this.direction === "topright") {
      ctx.moveTo(x, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y + this.height * cellSize);
      ctx.lineTo(x + gap, y + this.height * cellSize);
      ctx.lineTo(x + gap, y + this.height * cellSize - gap);
      ctx.lineTo(x, y + this.height * cellSize - gap);
      ctx.fill();
    } else if (this.direction === "topleft") {
      ctx.moveTo(x + this.width * cellSize, y + gap);
      ctx.lineTo(x + gap, y + gap);
      ctx.lineTo(x + gap, y + this.height * cellSize);
      ctx.lineTo(x + this.width * cellSize - gap, y + this.height * cellSize);
      ctx.lineTo(
        x + this.width * cellSize - gap,
        y + this.height * cellSize - gap
      );
      ctx.lineTo(x + this.width * cellSize, y + this.height * cellSize - gap);
      ctx.fill();
    } else if (this.direction === "bottomleft") {
      ctx.moveTo(x + gap, y);
      ctx.lineTo(x + gap, y + this.height * cellSize - gap);
      ctx.lineTo(x + this.width * cellSize, y + this.height * cellSize - gap);
      ctx.lineTo(x + this.width * cellSize, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y);
      ctx.fill();
    } else if (this.direction === "bottomright") {
      ctx.moveTo(x + this.width * cellSize - gap, y);
      ctx.lineTo(
        x + this.width * cellSize - gap,
        y + this.height * cellSize - gap
      );
      ctx.lineTo(x, y + this.height * cellSize - gap);
      ctx.lineTo(x, y + gap);
      ctx.lineTo(x + gap, y + gap);
      ctx.lineTo(x + gap, y);
      ctx.fill();
    } else if (this.direction === "3wayTop") {
      ctx.moveTo(x + gap, y);
      ctx.lineTo(x + gap, y + gap);
      ctx.lineTo(x, y + gap);
      ctx.lineTo(x, y + this.height * cellSize - gap);
      ctx.lineTo(x + this.width * cellSize, y + this.height * cellSize - gap);
      ctx.lineTo(x + this.width * cellSize, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y);
      ctx.fill();
    } else if (this.direction === "3wayBottom") {
      ctx.moveTo(x + gap, y + this.height * cellSize);
      ctx.lineTo(x + gap, y + this.height * cellSize - gap);
      ctx.lineTo(x, y + this.height * cellSize - gap);
      ctx.lineTo(x, y + gap);
      ctx.lineTo(x + this.width * cellSize, y + gap);
      ctx.lineTo(x + this.width * cellSize, y + this.height * cellSize - gap);
      ctx.lineTo(
        x + this.width * cellSize - gap,
        y + this.height * cellSize - gap
      );
      ctx.lineTo(x + this.width * cellSize - gap, y + this.height * cellSize);
      ctx.fill();
    } else if (this.direction === "3wayLeft") {
      ctx.moveTo(x, y + gap);
      ctx.lineTo(x, y + this.height * cellSize - gap);
      ctx.lineTo(x + gap, y + this.height * cellSize - gap);
      ctx.lineTo(x + gap, y + this.height * cellSize);
      ctx.lineTo(x + this.width * cellSize - gap, y + this.height * cellSize);
      ctx.lineTo(x + this.width * cellSize - gap, y);
      ctx.lineTo(x + gap, y);
      ctx.lineTo(x + gap, y + gap);
      ctx.fill();
    } else if (this.direction === "3wayRight") {
      ctx.moveTo(x + gap, y);
      ctx.lineTo(x + gap, y + this.height * cellSize);
      ctx.lineTo(x + this.width * cellSize - gap, y + this.height * cellSize);
      ctx.lineTo(
        x + this.width * cellSize - gap,
        y + this.height * cellSize - gap
      );

      ctx.lineTo(x + this.width * cellSize, y + this.height * cellSize - gap);
      ctx.lineTo(x + this.width * cellSize, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y);
      ctx.fill();
    } else if (this.direction === "4way") {
      ctx.moveTo(x + gap, y);
      ctx.lineTo(x + gap, y + gap);
      ctx.lineTo(x, y + gap);
      ctx.lineTo(x, y + this.height * cellSize - gap);
      ctx.lineTo(x + gap, y + this.height * cellSize - gap);
      ctx.lineTo(x + gap, y + this.height * cellSize);
      ctx.lineTo(x + this.width * cellSize - gap, y + this.height * cellSize);
      ctx.lineTo(
        x + this.width * cellSize - gap,
        y + this.height * cellSize - gap
      );
      ctx.lineTo(x + this.width * cellSize, y + this.height * cellSize - gap);
      ctx.lineTo(x + this.width * cellSize, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y + gap);
      ctx.lineTo(x + this.width * cellSize - gap, y);
      ctx.fill();
    }
  }
}

export { Road };
