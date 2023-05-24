import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from './styles/Main.module.css';

const TeachableMachine = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const URL = 'https://teachablemachine.withgoogle.com/models/SRyopUQdy/';
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      try {
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (webcamRef.current && model) {
      const video = webcamRef.current;

      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          video.addEventListener('loadedmetadata', () => {
            video.play();
          });
          setStream(stream);
        } catch (error) {
          console.error('Error accessing webcam:', error);
        }
      };

      video.addEventListener('error', (event) => {
        console.error('Video playback error:', event.target.error);
      });

      startVideo();
    }
  }, [model]);

  const classifyImage = async () => {
    if (!model) {
      return;
    }

    try {
      const imageCapture = new ImageCapture(webcamRef.current.srcObject.getVideoTracks()[0]);

      const bitmap = await imageCapture.grabFrame();
      const predictions = await model.predict(bitmap);

      const topPrediction = predictions.reduce((prev, current) => {
        return prev.probability > current.probability ? prev : current;
      });
      console.log(predictions);

      setPrediction(topPrediction.className);
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  };

  const clearPrediction = () => {
    setPrediction('');
  };

  return (
    <div className = {styles.Main}>
      <h1>Teachable Machine Demo</h1>
      <div>
        <button onClick={classifyImage}>Classify Image</button>
        <button onClick={clearPrediction}>Clear</button>
      </div>
      <div>
        <video ref={webcamRef} autoPlay playsInline muted width={480} height={360} />
      </div>
      <div>
        <h2>Prediction: {prediction}</h2>
      </div>
    </div>
  );
};

export default TeachableMachine;
