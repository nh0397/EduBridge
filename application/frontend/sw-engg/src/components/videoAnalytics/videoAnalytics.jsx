import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const VideoAnalytics = ({ onEmotionsDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function loadModels() {
      const MODEL_URL = 'http://127.0.0.1:5000/static/models/';
      await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
      await faceapi.loadFaceLandmarkModel(MODEL_URL);
      await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
      await faceapi.loadFaceRecognitionModel(MODEL_URL);
      await faceapi.loadFaceExpressionModel(MODEL_URL);
    }

    loadModels().then(startVideo);
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.addEventListener('play', () => {
      const video = videoRef.current;
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const displaySize = { width: video.width, height: video.height };
      
      faceapi.matchDimensions(canvas, displaySize);
      
      const intervalId = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          // Send the emotion data to Flask backend
          fetch("http://127.0.0.1:5000/emotion-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ expressions }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Emotion Data from Flask:', data);
              // Optionally call a prop callback to inform parent component
              onEmotionsDetected && onEmotionsDetected(data);
            })
            .catch((error) => console.error("Error:", error));
        }
      }, 100);

      return () => clearInterval(intervalId);
    });
  }, [onEmotionsDetected]);

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        width="200"
        height="200"
        autoPlay
        muted
        style={{ border: '1px solid black' }}
      ></video>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
};

export default VideoAnalytics;
