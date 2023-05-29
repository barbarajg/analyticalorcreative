import React from 'react';
import styles from '../styles/header.module.css';

export const Header = (props) => {
  return (
    <div className={styles.headerContainer}>
        <h1>{props.title}</h1>
        <h4>{props.subtitle}</h4>
        <h4>{props.subtitle2}</h4>
    </div>
  )
}
