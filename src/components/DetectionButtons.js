import React from 'react';
import styles from '../styles/buttons.module.css';

const DetectionButtons = ({ detecting, toggleDetection, clearPrediction }) => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.buttonCyan} onClick={toggleDetection}>
        {detecting ? 'Stop' : 'Detect'}
      </button>
      <button className={styles.buttonCyan} onClick={clearPrediction} disabled={!detecting}>
        Clear
      </button>
    </div>
  );
};

export default DetectionButtons;
