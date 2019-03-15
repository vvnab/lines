import { observable  } from "mobx";
import {Pos, Cell, Field} from "./assets/lines-lib";

const snap = [
  [0, 2, 0, 0, 0, 0, 0, 0],
  [0, 3, 0, 0, 8, 0, 0, 0],
  [0, 4, 1, 0, 0, 0, 0, 0],
  [0, 5, 0, 0, 4, 0, 0, 0],
  [0, 0, 5, 4, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 9, 4, 2],
  [0, 0, 3, 0, 0, 3, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0]
];

const field = new Field({
  arr: snap.map(i =>
    i.map(
      i =>
        new Cell({
          state: i
        })
    )
  )
});

class Store {
  @observable field = new Field(field);

  update = (pos: Pos, cell: Cell | object) => {
    this.field.setCell(pos, cell);
    this.field = this.field.clone();
  }

  born = (pos: Pos, cell: Cell | object) => {
    this.update(pos, { ...cell, born: true });
    setTimeout(() => this.update(pos, { born: false }), 0);
  };

  death = (pos: Pos) => {
    this.update(pos, { death: true, active: false });
    setTimeout(() => this.update(pos, { death: false, state: 0 }), 100);
  };

  error = (pos: Pos) => {
    this.update(pos, { error: true });
    setTimeout(() => this.update(pos, { error: false }), 150);
  }

  track = (pos: Pos) => {
    this.update(pos, { track: true });
    setTimeout(() => this.update(pos, { track: false }), 150);
  }

  click = (pos: Pos) => {
    const cell = this.field.getCell(pos);
    const activePos = this.field.getActive();
    if (activePos && pos.equal(activePos)) {
      // активируем/останавливаем
      this.update(pos, { active: !cell.active });
    } else if (activePos && cell.state > 0) {
      // перевыбор
      this.field.unactivateAll();
      this.update(pos, { active: true });
    } else if (cell.state > 0) {
      // активируем
      this.update(pos, { active: true });
    } else if (activePos) {
      // перемещаем
      const route = this.field.getRoute(activePos, pos);
      if (route) {
        this.born(pos, this.field.getCell(activePos));
        this.death(activePos);
        this.field.unactivateAll();
      } else {
        this.error(pos);  
      }
    } else {
      // пусто
      this.error(pos);
    }
  };
}

const store = new Store();

export default store;
