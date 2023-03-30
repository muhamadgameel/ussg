import { Road } from "./road";
import { RoadNetwork } from "./road-network";
import { World } from "./world";
import { getNeighbourCells, getDom } from "./utils";

const canvas = document.getElementById("worldCanvas") as HTMLCanvasElement;

const width = canvas.width;
const height = canvas.height;
const cellSize = 20;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const world = new World(width, height);

const ports = [{ x: 30, y: 41, width: 3, height: 4, connected: false }];
const houses = [{ x: 10, y: 10, width: 3, height: 2, connected: false }];

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  if (world.selection === "POINTER") {
  } else if (world.selection === "ROAD") {
    const current_cell = world.getMapCell(x, y);

    if (current_cell.type === "ROAD") return;
    // first network
    if (!world.roads_networks.length) {
      const network = new RoadNetwork(
        [new Road({ x, y, direction: "vertical" })],
        world
      );
      world.addRoadNetwork(network);
      return;
    }

    // check if neighbour is a road
    const neighbours = getNeighbourCells(x, y, 1, 1);
    const road = new Road({ x, y });
    let fn = false;

    const directions = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };
    let current_network;
    for (let i = 0; i < neighbours.length; i++) {
      const n = neighbours[i];
      const cellInfo = world.getMapCell(n.x, n.y);

      if (cellInfo.type === "ROAD") {
        current_network = world.getRoadNetwork(cellInfo.data.network_id);

        fn = true;
        if (
          road.network_id === null ||
          road.network_id === current_network.id
        ) {
          road.network_id = current_network.id;

          current_network.addRoad(road, world);
        } else {
          const next_network = current_network;
          // merge & create new network
          const prev_network = world.getRoadNetwork(road.network_id);
          current_network = world.margeRoadNetwords(prev_network, next_network);

          road.network_id = current_network.id;
        }

        directions[n.location] = true;
      }

      // console.log("------");
    }

    if (fn) {
      road.adjustDirection(directions);

      for (let i = 0; i < neighbours.length; i++) {
        const n = neighbours[i];
        const cellInfo = world.getMapCell(n.x, n.y);
        if (cellInfo.type === "ROAD") {
          const dd = { left: false, right: false, top: false, bottom: false };
          const nn = getNeighbourCells(n.x, n.y, 1, 1);

          for (let j = 0; j < nn.length; j++) {
            const nnr = nn[j];
            const ci = world.getMapCell(nnr.x, nnr.y);
            if (ci.type === "ROAD") {
              dd[nnr.location] = true;
            }
          }

          const n_node = current_network?.road_nodes.find(
            (z) => z.x === n.x && z.y === n.y
          );
          n_node?.adjustDirection(dd);
        }
      }

      return;
    }

    // new network
    const network = new RoadNetwork(
      [new Road({ x, y, direction: "vertical" })],
      world
    );
    world.addRoadNetwork(network);
  }
});

const drawGrid = () => {
  ctx.beginPath();
  for (let i = 0; i < width / cellSize; i++) {
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, height);
  }

  for (let i = 0; i < height / cellSize; i++) {
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(width, i * cellSize);
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.stroke();
};

const drawHouses = () => {
  ctx.fillStyle = "rgb(0, 0, 255)";
  for (let i = 0; i < houses.length; i++) {
    const house = houses[i];
    ctx.fillRect(
      house.x * cellSize,
      house.y * cellSize,
      house.width * cellSize,
      house.height * cellSize
    );
  }

  ctx.fillStyle = "rgb(123, 121, 255)";
  for (let i = 0; i < ports.length; i++) {
    const port = ports[i];
    ctx.fillRect(
      port.x * cellSize,
      port.y * cellSize,
      port.width * cellSize,
      port.height * cellSize
    );
  }
};

const draw = () => {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(0, 200, 0, 1)";
  ctx.fillRect(0, 0, width, height);

  drawGrid();
  drawHouses();

  for (let i = 0; i < world.roads_networks.length; i++) {
    const network = world.roads_networks[i];
    network.renderRoads(ctx, cellSize);
  }
};

const mainLoop = (dx: number) => {
  draw();

  const hud_roads_networds = document.getElementById("roadsNetworks")!;
  hud_roads_networds.innerText = `Road Networks: ${world.roads_networks.length}`;

  requestAnimationFrame(mainLoop);
};

window.onPointerSelectionClick = () => {
  world.selection = "POINTER";
};

window.onRoadSelectionClick = () => {
  world.selection = "ROAD";
};

requestAnimationFrame(mainLoop);
