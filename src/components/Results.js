import React from 'react';
import styles from '../styles/results.module.css';

const Results = ({ prediction, predictions }) => {
  return (
    <div className={styles.resultsContainer}>
      <h2>Prediction: {prediction}</h2>
      {predictions.map((pred, index) => (
        <a key={index}>
          {`${pred.className}: ${(pred.probability * 100).toFixed(2)}%`}
        </a>
      ))}
    </div>
  );
};

export default Results;
