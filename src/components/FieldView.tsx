import React from "react";
import styles from "./FieldView.module.scss";
import * as data from "../assets/lines-lib";
import Cell from "./CellView";

const Field = ({ field }: { field: data.Field }) => {
  return (
    <div className={styles.field}>
      {field.arr.map((i, y) => (
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
