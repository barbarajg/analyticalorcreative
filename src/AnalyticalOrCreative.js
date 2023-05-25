import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from './styles/Main.module.css';

const TeachableMachine = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [detecting, setDetecting] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const URL = 'https://teachablemachine.withgoogle.com/models/SRyopUQdy/';
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      try {
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        setModelLoaded(true);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (webcamRef.current && model && modelLoaded) {
      const video = webcamRef.current;

      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          video.addEventListener('loadedmetadata', () => {
            video.play();
          });
        } catch (error) {
          console.error('Error accessing webcam:', error);
        }
      };

      video.addEventListener('error', (event) => {
        console.error('Video playback error:', event.target.error);
      });

      startVideo();
    }
  }, [model, modelLoaded]);

  const classifyContinuous = async () => {
    if (!model) {
      return;
    }

    try {
      const videoTracks = webcamRef.current?.srcObject?.getVideoTracks();
      if (!videoTracks || videoTracks.length === 0) {
        throw new Error('No video tracks available');
      }

      const imageCapture = new ImageCapture(videoTracks[0]);

      const bitmap = await imageCapture.grabFrame();
      const predictions = await model.predict(bitmap);

      console.log(predictions);
      setPredictions(predictions);

      const topPrediction = predictions.reduce((prev, current) => {
        return prev.probability > current.probability ? prev : current;
      });

      setPrediction(topPrediction.className);
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  };

  useEffect(() => {
    let intervalId;

    if (detecting && modelLoaded) {
      classifyContinuous();
      intervalId = setInterval(classifyContinuous, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [detecting, modelLoaded]);

  const toggleDetection = () => {
    setDetecting((prevState) => !prevState);
  };

  const clearPrediction = () => {
    setPrediction('');
    setPredictions([]);
    setDetecting(false);
  };

  useEffect(() => {
    if (detecting && modelLoaded) {
      classifyContinuous();
    }
  }, [detecting, modelLoaded]);

  return (
    <div className={styles.Main}>
      <h1>Teachable Machine Demo</h1>
      <div>
        <button onClick={toggleDetection}>
          {detecting ? 'Stop' : 'Detect'}
        </button>
        <button onClick={clearPrediction}>Clear</button>
      </div>
      <div>
        <video ref={webcamRef} autoPlay playsInline muted width={480} height={360} />
      </div>
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
    </div>
  );
};

export default TeachableMachine;
