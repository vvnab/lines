import React, { Component } from 'react';
import styles from './Main.module.scss';
import Field from "../components/FieldView";

class Main extends Component {
  render() {
    return (
      <div className={styles.root}>
        <header className={styles.header}>
        </header>
        <section className={styles.main}>
          <Field />
        </section>
        <footer className={styles.footer}>
        </footer>
      </div>
    );
  }
}

export default Main;
