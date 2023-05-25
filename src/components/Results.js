import React from 'react';

const Results = ({ prediction, predictions }) => {
  return (
    <div>
      <h2>Prediction: {prediction}</h2>
      <ul>
        {predictions.map((pred, index) => (
          <li key={index}>
            {`${pred.className}: ${(pred.probability * 100).toFixed(2)}%`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
