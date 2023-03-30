import { Road } from "./road";
import { World } from "./world";

interface IRoadNetwork {
  id: number;
  name: string;
  road_nodes: Road[];
  color: string;
}

let NETWORDS_ID = 0;

class RoadNetwork implements IRoadNetwork {
  id: number;
  name: string;
  road_nodes: Road[];
  color: string;

  constructor(public r: Road[] = [], world: World) {
    const id = NETWORDS_ID;
    const road_nodes: Road[] = r;

    road_nodes.forEach((item, index) => {
      road_nodes[index].network_id = id;
      world.setMapCell(item.x, item.y, {
        type: "ROAD",
        data: { network_id: id },
      });
    });

    this.id = id;
    this.name = `Road Network #${id}`;
    this.road_nodes = road_nodes;
    this.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 1)`;

    NETWORDS_ID++;
  }

  static MergeNetworks(first: RoadNetwork, second: RoadNetwork, world: World) {
    const combined_roads = [...first?.road_nodes, ...second?.road_nodes];

    const result = new RoadNetwork(combined_roads, world);
    world.addRoadNetwork(result);

    // update world data
    for (let z = 0; z < result.road_nodes.length; z++) {
      const road = result.road_nodes[z];
      world.map[road.x][road.y].data = { network_id: result.id };
    }

    // remove merged networks
    world.removeRoadNetwork(first.id);
    world.removeRoadNetwork(second.id);

    return result;
  }

  addRoad(road: Road, world: World) {
    world.setMapCell(road.x, road.y, {
      type: "ROAD",
      data: { network_id: this.id },
    });
    this.road_nodes.push(road);
  }

  renderRoads(ctx: CanvasRenderingContext2D, cellSize: number) {
    for (let j = 0; j < this.road_nodes.length; j++) {
      const node = this.road_nodes[j];

      // draw roads
      node.render(ctx, node.x * cellSize, node.y * cellSize, cellSize);

      // draw network nodex
      ctx.fillStyle = this.color;
      ctx.fillRect(
        node.x * cellSize + cellSize / 3,
        node.y * cellSize + cellSize / 3,
        cellSize / 4,
        cellSize / 4
      );
    }
  }
}

export { RoadNetwork };
