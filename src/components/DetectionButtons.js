import React from 'react';

const DetectionButtons = ({ detecting, toggleDetection, clearPrediction }) => {
  return (
    <div>
      <button onClick={toggleDetection}>
        {detecting ? 'Stop' : 'Detect'}
      </button>
      <button onClick={clearPrediction} disabled={!detecting}>
        Clear
      </button>
    </div>
  );
};

export default DetectionButtons;
