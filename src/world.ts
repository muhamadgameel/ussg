import { RoadNetwork } from "./road-network";

type IEmptyCell = {
  type: "EMPTY";
  data: null;
};

type IRoadCell = {
  type: "ROAD";
  data: { network_id: number };
};

type ICell = IEmptyCell | IRoadCell;

type ISelection = "POINTER" | "REMOVE" | "ROAD";

class World {
  map: ICell[][];
  roads_networks: RoadNetwork[];
  selection: ISelection;

  constructor(public width: number, public height: number) {
    this.map = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => ({ type: "EMPTY", data: null }))
    );

    this.width = width;
    this.height = height;

    this.roads_networks = [];
    this.selection = "POINTER";
  }

  getMapCell(x: number, y: number) {
    return this.map[x][y];
  }

  setMapCell(x: number, y: number, cellInfo: ICell) {
    this.map[x][y].type = cellInfo.type;
    this.map[x][y].data = cellInfo.data;
  }

  getRoadNetwork(id: number) {
    return this.roads_networks.find((n) => n.id === id)!;
  }

  addRoadNetwork(n: RoadNetwork) {
    this.roads_networks.push(n);
  }

  removeRoadNetwork(id: number) {
    const index = this.roads_networks.findIndex((i) => i.id === id);
    if (index > -1) {
      this.roads_networks.splice(index, 1);
    }
  }

  margeRoadNetwords(first: RoadNetwork, second: RoadNetwork) {
    return RoadNetwork.MergeNetworks(first, second, this);
  }
}

export { World };
