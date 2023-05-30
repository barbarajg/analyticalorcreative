import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from '../styles/Main.module.css';
import DetectionButtons from './DetectionButtons';
import Results from './Results';

const CamIdentifier = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [clearResults, setClearResults] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const modelURL = 'https://teachablemachine.withgoogle.com/models/SRyopUQdy/model.json';
      const metadataURL = 'https://teachablemachine.withgoogle.com/models/SRyopUQdy/metadata.json';

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
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamRef.current.srcObject = stream;
        webcamRef.current.addEventListener('loadedmetadata', () => {
          webcamRef.current.play();
          setDetecting(true);
        });
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    if (webcamRef.current && model && modelLoaded) {
      webcamRef.current.addEventListener('error', (event) => {
        console.error('Video playback error:', event.target.error);
      });

      startVideo();
    }
  }, [model, modelLoaded]);

  const classify = async () => {
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

      const topPrediction = predictions.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      );

      setPrediction(topPrediction.className);
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  };

  useEffect(() => {
    let intervalId;

    const startClassification = () => {
      classify();
      intervalId = setInterval(classify, 1000);
    };

    if (detecting && modelLoaded) {
      startClassification();
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [detecting, modelLoaded]);

  const toggleDetection = () => {
    setDetecting((prevDetecting) => !prevDetecting);
    setClearResults(false);
  };

  const handleClearButtonClick = () => {
    console.log('CLEAR');
    setClearResults(true);
    setDetecting(false);
    setPrediction('');
    setPredictions([]);
  };

  return (
    <div className={styles.Main}>
      <div>
        <video className={styles.cam} ref={webcamRef} autoPlay playsInline muted />
      </div>
      <DetectionButtons
        detecting={detecting}
        toggleDetection={toggleDetection}
        clearPrediction={handleClearButtonClick}
      />
      {clearResults ? (
        <Results prediction='' predictions={[]} />
      ) : (
        <Results prediction={prediction} predictions={predictions} />
      )}
    </div>
  );
};

export default CamIdentifier;
