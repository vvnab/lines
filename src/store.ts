import { observable, computed, autorun } from "mobx";
import _ from "lodash";

const SIZE = 6;
const COLORS = 6;
const COUNT = 2;
const START_COUNT = 10;

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
  pos: Pos;
  state: number;
  count: number;
  active: boolean;
  freeze: boolean;
  born: boolean;
  death: boolean;
  track: boolean;
  error: boolean;
  constructor({
    pos = new Pos(-1, -1),
    state = 0,
    count = 1,
    active = false,
    freeze = false,
    born = false,
    death = false,
    track = false,
    error = false
  }) {
    this.pos = pos;
    this.state = state;
    this.count = count;
    this.active = active;
    this.freeze = freeze;
    this.born = born;
    this.death = death;
    this.track = track;
    this.error = error;
  }
}

class Field {
  @observable arr: Cell[][];
  @observable rules: object;
  @observable score: number = 0;
  @observable end: boolean = false;
  size: number;
  max: number;

  directions = {
    up: new Pos(0, -1),
    right: new Pos(1, 0),
    down: new Pos(0, 1),
    left: new Pos(-1, 0),
    backslash: new Pos(1, 1),
    slash: new Pos(1, -1)
  };

  constructor({ arr = [], size = SIZE, rules = {} }) {
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
    this.bornRandom(START_COUNT);
    this.checkForDeath();
  }

  update = () => {
    this.arr = [...this.arr];
  };

  getCell = (pos: Pos) => {
    return this.arr[pos.y][pos.x];
  };

  unactivateAll = () => {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.arr[y][x] = {
          ...this.arr[y][x],
          active: false
        };
      }
    }
    this.update();
  };

  getFreeCells = () => {
    const arr: Cell[] = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const cell = this.getCell(new Pos(x, y));
        if (cell.state === 0) {
          arr.push(cell);
        }
      }
    }
    return arr;
  }

  getLine = (pos: Pos, direction: Pos) => {
    let state: number = 0;
    let arr: Cell[] = [];
    while (pos.x >= 0 && pos.x <= this.max && pos.y >= 0 && pos.y <= this.max) {
      const cell = this.getCell(pos);
      if (cell.state === 0) {
        // пустая клетка
        arr = arr.length > 3 ? arr : [];
      } else if (cell.state !== state) {
        // шарик другого цвета
        arr = arr.length > 3 ? arr : [cell];
      } else if (arr.length > 0 && cell.state === state) {
        arr.push(cell);
      }
      state = cell.state;
      pos.move(direction);
    }
    return arr.length > 3 ? arr : [];
  };

  checkForDeath = () => {
    const deaths: Cell[][] = [];
    // по горизонтали
    for (let y = 0; y < this.size; y++) {
      const line = this.getLine(new Pos(0, y), this.directions.right);
      if (line.length > 0) {
        deaths.push(line);
      }
    }
    // по вертикали
    for (let x = 0; x < this.size; x++) {
      const line = this.getLine(new Pos(x, 0), this.directions.down);
      if (line.length > 0) {
        deaths.push(line);
      }
    }
    // по диагонали \ сверху
    for (let x = 1; x < this.max; x++) {
      const line = this.getLine(new Pos(x, 0), this.directions.backslash);
      if (line.length > 0) {
        deaths.push(line);
      }
    }
    // по диагонали \ слева
    for (let y = 0; y < this.size; y++) {
      const line = this.getLine(new Pos(0, y), this.directions.backslash);
      if (line.length > 0) {
        deaths.push(line);
      }
    }
    // по диагонали / снизу
    for (let x = 1; x < this.max; x++) {
      const line = this.getLine(new Pos(x, this.max), this.directions.slash);
      if (line.length > 0) {
        deaths.push(line);
      }
    }
    // // по диагонали / слева
    for (let y = this.max; y >= 0; y--) {
      const line = this.getLine(new Pos(0, y), this.directions.slash);
      if (line.length > 0) {
        deaths.push(line);
      }
    }
    let score = 0;
    deaths.forEach(row =>
      row.forEach(cell => {
        this.death(cell.pos);
        score++;
      })
    );
    this.score += score ? Math.pow(2, score) : 0;
  };

  setCell = (pos: Pos, cell: Cell | object | number) => {
    if (typeof cell === "object") {
      this.arr[pos.y][pos.x] = {
        ...this.arr[pos.y][pos.x],
        ...cell,
        pos
      };
    } else {
      this.arr[pos.y][pos.x] = new Cell({
        pos,
        state: cell
      });
    }
    this.update();
  };

  getActive: Pos | any = () =>
    this.arr.reduce(
      (s: any, row, y) =>
        row.reduce(
          (s: any, cell, x) => (cell.active ? new Pos(x, y) : s),
          null
        ) || s,
      null
    );

  getRoute = (posBgn: Pos, posEnd: Pos) => {
    const open: number[][] = this.arr.map(i => i.map(i => i.state));
    const closed: number[][] = [[]];
    const route: Pos[] = [];
    return true;
  };

  born = (pos: Pos, cell: Cell | object) => {
    this.setCell(pos, { ...cell, born: true });
    setTimeout(() => this.setCell(pos, { born: false }), 0);
    setTimeout(this.checkForDeath, 300);
  };

  bornRandom = (count = COUNT) => {
    const freeCells = this.getFreeCells();
    if (freeCells.length <= count) {
      this.end = true;
      count = freeCells.length;
    }
    const balls: Cell[] = [];
    while (balls.length < count) {
      const pos = new Pos(_.random(this.max), _.random(this.max));
      if (this.getCell(pos).state === 0) {
        const ball = new Cell({
          pos,
          state: _.random(COLORS - 1) + 1
        });
        balls.push(ball);
        this.born(ball.pos, ball);
      }
    }
  };

  death = (pos: Pos) => {
    this.setCell(pos, { death: true, active: false });
    setTimeout(() => this.setCell(pos, { death: false, state: 0 }), 100);
  };

  error = (pos: Pos) => {
    this.setCell(pos, { error: true });
    setTimeout(() => this.setCell(pos, { error: false }), 150);
  };

  track = (pos: Pos) => {
    this.setCell(pos, { track: true });
    setTimeout(() => this.setCell(pos, { track: false }), 150);
  };

  move = (posBgn: Pos, posEnd: Pos) => {
    this.born(posEnd, this.getCell(posBgn));
    this.death(posBgn);
    this.unactivateAll();
    setTimeout(this.bornRandom, 300);
  };

  click = (pos: Pos) => {
    const cell = this.getCell(pos);
    const activePos = this.getActive();
    if (activePos && pos.equal(activePos)) {
      // активируем/останавливаем
      this.setCell(pos, { active: !cell.active });
    } else if (activePos && cell.state > 0) {
      // перевыбор
      this.unactivateAll();
      this.setCell(pos, { active: true });
    } else if (cell.state > 0) {
      // активируем
      this.setCell(pos, { active: true });
    } else if (activePos) {
      // перемещаем
      const route = this.getRoute(activePos, pos);
      if (route) {
        this.move(activePos, pos);
      } else {
        this.error(pos);
      }
    } else {
      // пусто
      this.error(pos);
    }
  };
}

const store = new Field({size: SIZE});

export default store;
export { Pos, Cell };
