import React from "react";
import styles from "./FieldView.module.scss";
import * as data from "../assets/lines-lib";
import Cell from "./CellView";

const snap = [
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0]
];

const field = new data.Field({
  arr: snap.map(i => i.map(i => new data.Cell({
    state: i
  })))
});


const Field = () => {
  return <div className={styles.field} />;
};

export default Field;
