import React, { Component } from "react";
import styles from "./Main.module.scss";
import Field from "../components/FieldView";
import { observer } from "mobx-react";
import store from "../store";

@observer
class Main extends Component {
  render() {
    return (
      <div className={styles.root}>
        <header className={styles.header} />
        <section className={styles.main}>
          <Field field={store.field} />
        </section>
        <footer className={styles.footer} />
      </div>
    );
  }
}

export default Main;
