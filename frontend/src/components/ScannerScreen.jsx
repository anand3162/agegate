import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase';

const AGE_THRESHOLD = 25;

function ScannerScreen() {
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [modelsLoading, setModelsLoading] = useState(true);

  useEffect(() => {
    async function startCamera() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.ageGenderNet.loadFromUri("/models");
        setModelsLoading(false);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        setCameraError(
          "Camera access denied. Please allow camera permissions.",
        );
      }
    }
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function handleScan() {
  const detection = await faceapi
    .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
    .withAgeAndGender();

  if (!detection) {
    setCameraError("No face detected. Try again.");
    return;
  }

  const blob = await captureFrame();
  const imageUrl = await uploadImage(blob);

  setResult({
    age: Math.round(detection.age),
    gender: detection.gender,
    recommendation: getRecommendation(Math.round(detection.age)),
    imageUrl,
  });
}

async function handleConfirm(actionTaken) {
  try {
    const token = await auth.currentUser.getIdToken();
    await fetch('http://localhost:3001/api/scans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        estimatedAgeRange: String(result.age),
        recommendation: result.recommendation,
        actionTaken,
        staffId: auth.currentUser.uid,
        imageUrl: result.imageUrl,
      }),
    });
    setResult(null);
  } catch (err) {
    setCameraError('Failed to save scan. Try again.');
  }
}


  function getRecommendation(age) {
    return age >= AGE_THRESHOLD ? "Looks Clear" : "Check ID";
  }

  function captureFrame() {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
}

async function uploadImage(blob) {
  // TESTER-ONLY: image capture is for consenting testers only, not real customers
  const filename = `tester-scans/${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}



  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      {modelsLoading && <p>Loading models...</p>}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {cameraError && <p style={{ color: "red" }}>{cameraError}</p>}
      <h2>Ready to Scan</h2>
      <button onClick={handleScan}>Scan</button>
      {result && <button onClick={() => setResult(null)}>Reset</button>}
      {result && (
        <div>
          <p>Estimated Age: {result.age}</p>
          <p>Gender: {result.gender}</p>
          <p>Recommendation: {result.recommendation}</p>
          <button onClick={() => handleConfirm('ID Checked')}>ID Checked</button>
          <button onClick={() => handleConfirm('Not Needed')}>Not Needed</button>
        </div>
      )}
    </div>
  );
}
export default ScannerScreen;
