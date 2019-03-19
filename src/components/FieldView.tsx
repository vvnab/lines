import React from "react";
import styles from "./FieldView.module.scss";
import * as data from "../store";
import Cell from "./CellView";

const Field = ({ field }: { field: data.Cell[][] }) => {
  return (
    <div className={styles.field}>
      {field.map((i, y) => (
        <div className={styles.row} key={y}>
          {i.map((i, x) => (
            <Cell key={x} value={i} pos={new data.Pos(x, y)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Field;
