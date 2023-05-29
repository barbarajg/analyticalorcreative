import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from '../styles/Main.module.css';
import DetectionButtons from './DetectionButtons';
import Results from './Results';

const CamIdentifier = () => {
  const webcamRef = useRef(null); // Create a reference for the webcam video element
  const [model, setModel] = useState(null); // State to store the loaded machine learning model
  const [predictions, setPredictions] = useState([]); // State to store the predicted results
  const [prediction, setPrediction] = useState(''); // State to store the top prediction
  const [detecting, setDetecting] = useState(true); // State to control detection status (start/stop)
  const [modelLoaded, setModelLoaded] = useState(false); // State to track if the model is loaded

  useEffect(() => {
    // Load the Teachable Machine model on component mount
    const loadModel = async () => {
      const modelURL = 'https://teachablemachine.withgoogle.com/models/SRyopUQdy/model.json';
      const metadataURL = 'https://teachablemachine.withgoogle.com/models/SRyopUQdy/metadata.json';

      try {
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel); // Set the loaded model in the state
        setModelLoaded(true); // Update the model loaded state
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel(); // Call the function to load the model on component mount
  }, []);

  useEffect(() => {
    // Start the video stream on component mount
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamRef.current.srcObject = stream; // Set the video stream as the source for the webcam video element
        webcamRef.current.addEventListener('loadedmetadata', () => {
          webcamRef.current.play(); // Start playing the video once metadata is loaded
        });
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    if (webcamRef.current && model && modelLoaded) {
      // Check if the webcam reference, model, and modelLoaded state are all truthy
      webcamRef.current.addEventListener('error', (event) => {
        console.error('Video playback error:', event.target.error);
      });

      startVideo(); // Call the function to start the video stream
    }
  }, [model, modelLoaded]);

  const classify = async () => {
    // Perform image classification using the loaded model
    if (!model) {
      return; // If the model is not loaded, exit the function
    }

    try {
      const videoTracks = webcamRef.current?.srcObject?.getVideoTracks();
      if (!videoTracks || videoTracks.length === 0) {
        throw new Error('No video tracks available'); // If no video tracks are available, throw an error
      }

      const imageCapture = new ImageCapture(videoTracks[0]);
      const bitmap = await imageCapture.grabFrame();
      const predictions = await model.predict(bitmap);

      console.log(predictions); // Log the predictions to the console
      setPredictions(predictions); // Set the predicted results in the state

      const topPrediction = predictions.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      );

      setPrediction(topPrediction.className); // Set the top prediction in the state
    } catch (error) {
      console.error('Error capturing frame:', error); // Log any errors that occur during frame capture
    }
  };

  useEffect(() => {
    // Start or stop the classification process based on the detecting and modelLoaded states
    let intervalId;

    const startClassification = () => {
      classify();
      intervalId = setInterval(classify, 1000); // Perform classification every second
    };

    if (detecting && modelLoaded) {
      startClassification(); // Start classification if detecting is true and model is loaded
    } else {
      clearInterval(intervalId); // Stop classification if detecting is false or model is not loaded
    }

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, [detecting, modelLoaded]);

  const toggleDetection = () => {
    setDetecting((prevState) => !prevState); // Toggle the detecting state (start/stop)
  };

  const clearPrediction = () => {
    setPrediction(''); // Clear the prediction state
    setPredictions([]); // Clear the predictions state
    setDetecting(false); // Stop detection
  };

  useEffect(() => {
    // Perform classification when detecting is true and model is loaded
    if (detecting && modelLoaded) {
      classify();
    }
  }, [detecting, modelLoaded]);

  return (
    <div className={styles.Main}>
      <div>
        <video className={styles.cam} ref={webcamRef} autoPlay playsInline muted />
      </div>
      <DetectionButtons
        detecting={detecting}
        toggleDetection={toggleDetection}
        clearPrediction={clearPrediction}
      />
      <Results prediction={prediction} predictions={predictions} />
    </div>
  );
};

export default CamIdentifier;
