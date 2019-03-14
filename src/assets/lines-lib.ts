class Pos {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  clone() {
    return new Pos(this.x, this.y);
  }
  right() {
    this.x++;
    return this;
  }
  left() {
    this.x--;
    return this;
  }
  up() {
    this.y--;
    return this;
  }
  down() {
    this.y++;
    return this;
  }
  move(direction: Pos) {
    this.x += direction.x;
    this.y += direction.y;
    return this;
  }
  equal(pos: Pos) {
    return this.x == pos.x && this.y == pos.y;
  }
}

class Cell {
  state: number;
  count: number;
  active: boolean;
  freeze: boolean;
  constructor({ state = 0, count = 1, active = false, freeze = false }) {
    this.state = state;
    this.count = count;
    this.active = active;
    this.freeze = freeze;
  }
}

interface IProcessPath {
      
}


class Field {
  size: number;
  arr: Cell[][];
  rules: object;
  max: number;
  constructor({ arr = [[new Cell({})]], size = 7, rules = {} }) {
    if (arr.length > 0) {
      this.size = arr.length;
      this.arr = [...arr];
    } else {
      this.size = size;
      this.arr = new Array(size);
      for (let i = 0; i < size; i++) {
        this.arr[i] = new Array(size);
        this.arr[i].fill(new Cell({}));
      }
    }
    this.max = this.size - 1;
    this.rules = rules;
  }

  getCell = (pos: Pos) => {
    return this.arr[pos.y][pos.x];
  };

  setCell = (pos: Pos, cell: Cell | number) => {
    if (typeof cell === "object") {
      this.arr[pos.y][pos.x] = {
        ...this.arr[pos.y][pos.x],
        ...cell
      };
    } else {
      this.arr[pos.y][pos.x] = new Cell({
        state: cell
      });
    }
  };

  getRoute = (posBgn: Pos, posEnd: Pos) => {
    this.setCell(posBgn, 3);
    this.setCell(posEnd, 3);
    return this.processPath({
      field: new Field({ arr: [...this.arr] }),
      posBgn: posBgn.clone(),
      posEnd: posEnd.clone(),
      path: []
    });
  };
  
  processPath = ({
    field,
    posBgn,
    posEnd,
    path
  }: {
    field: Field;
    posBgn: Pos;
    posEnd: Pos;
    path: Pos[];
  }) => {
    const up = new Pos(0, -1);
    const right = new Pos(0, -1);
    const down = new Pos(0, -1);
    const left = new Pos(0, -1);
    // расставляем направления
    const directions = [up, right, down, left];
    // двигаемся...
    for (let i in directions) {
      let pos = posBgn.clone().move(directions[i]);
      if (pos.equal(posEnd)) {
        // BINGO!!!
        path.push(pos);
        break;
      } else if (field.getCell(pos).state == 0) {
        // GO
      } else {
        // BLOCK
        field.setCell(posBgn, -1);
      }
    }
    return path;
  };
}

export { Pos, Cell, Field };