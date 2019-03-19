class Graph {
  field = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
  ];

  bingo = false;

  // constructor(field) {
  //   this.field = field;
  // }

  getNeighbors = (arr, pos) => {
    const neighbors = [];
    const max = arr.length - 1;
    if (pos.y - 1 >= 0 && arr[pos.y - 1][pos.x] == 0) {
      neighbors.push({
        x: pos.x,
        y: pos.y - 1
      });
    }
    if (pos.y + 1 <= max && arr[pos.y + 1][pos.x] == 0) {
      neighbors.push({
        x: pos.x,
        y: pos.y + 1
      });
    }
    if (pos.x - 1 >= 0 && arr[pos.y][pos.x - 1] == 0) {
      neighbors.push({
        x: pos.x - 1,
        y: pos.y
      });
    }
    if (pos.x + 1 <= max && arr[pos.y][pos.x + 1] == 0) {
      neighbors.push({
        x: pos.x + 1,
        y: pos.y
      });
    }
    return neighbors;
  }

  search = (from, to, path = []) => {
    const neighbors = this.getNeihbors(from, to);
    for (i in neighbors) {
      if (end) break;
      const route = [];
      if (i.x === to.x && i.y === to.y) {
        // нашли!
        break;
      } else {
        this.field[i.x, i.y] = 1;
        route.push(i);
        path = this.search(i, to, route);
      }
    }
    return path;
  }
}

const graph = new Graph();
graph.search({
  x: 0,
  y: 3
}, {
  x: 2,
  y: 2
});

export default Graph;