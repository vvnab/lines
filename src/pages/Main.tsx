import React, { Component } from "react";
import styles from "./Main.module.scss";
import Field from "../components/FieldView";
import { observer } from "mobx-react";
import store from "../store";
import { PassThrough } from "stream";

@observer
class Main extends Component {
  render() {
    return (
      <div className={styles.root}>
        <header className={styles.header}>
          {store.end ? <h2>THE END</h2> : <h2>SCORES: {store.score}</h2>}
        </header>
        <section className={styles.main}>
          <Field field={store.arr} />
        </section>
        <footer className={styles.footer} />
      </div>
    );
  }
}

export default Main;
