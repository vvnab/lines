import React from "react";
import _ from "lodash";
import field from "../store";
import styles from "./CellView.module.scss";
import * as data from "../store";

const Cell = ({ value, pos }: { value: data.Cell; pos: data.Pos }) => {
  const cellStyles = [styles.cell];
  const ballStyles = [styles.ball, styles[`ball-${value.state}`], `col-${value.state}`];
  if (!value.freeze) {
    cellStyles.push(styles.ready);
  } else {
    ballStyles.push(styles.freeze);
  }
  if (value.active) {
    ballStyles.push(styles.active);
  }
  if (value.born) {
    ballStyles.push(styles.born);
  }
  if (value.death) {
    ballStyles.push(styles.death);
  }
  if (value.track) {
    cellStyles.push(styles.track);
  }
  if (value.error) {
    cellStyles.push(styles.error);
  }
  const onClick = () => {
    field.click(pos);
  };
  return (
    <div className={cellStyles.join(" ")} onClick={onClick}>
      {value.state > 0 && <div className={ballStyles.join(" ")} />}
    </div>
  );
};

export default Cell;
