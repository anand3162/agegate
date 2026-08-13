import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase';
import { signOut } from 'firebase/auth';

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
    gender: detection.gender,
    ageRange: getAgeRange(Math.round(detection.age)),
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
        estimatedAgeRange: result.ageRange,
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

  function getAgeRange(age) {
    if (age < 18) return "Under 18";
    if (age < 21) return "18-21";
    if (age < 25) return "21-25";
    if (age < 30) return "25-30";
    return "30+";
  }

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
  }

async function uploadImage(blob) {
  // TESTER-ONLY: image capture is for consenting testers only, not real customers
  const filename = `tester-scans/${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}



  const isLooksClear = result?.recommendation === 'Looks Clear';

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a2332' }}>AgeGate Scanner</h2>
          {modelsLoading && <p style={{ fontSize: '13px', color: '#6b7280' }}>Loading AI models...</p>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.location.href = '/history'}
            style={{ background: 'none', color: '#1a2332', border: '1px solid #d1d5db', fontSize: '13px', padding: '8px 14px' }}
          >
            History
          </button>
          <button
            onClick={() => signOut(auth)}
            style={{ background: 'none', color: '#6b7280', border: '1px solid #d1d5db', fontSize: '13px', padding: '8px 14px' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ background: '#000', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block' }} />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {cameraError && (
        <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{cameraError}</p>
      )}

      {!result ? (
        <button onClick={handleScan} style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '8px' }}>
          Scan
        </button>
      ) : (
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          borderTop: `4px solid ${isLooksClear ? '#16a34a' : '#dc2626'}`,
        }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>Estimated Age Range</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#1a2332' }}>{result.ageRange}</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Recommendation</p>
            <span style={{
              display: 'inline-block',
              padding: '5px 14px',
              borderRadius: '20px',
              fontWeight: '600',
              fontSize: '14px',
              background: isLooksClear ? '#dcfce7' : '#fee2e2',
              color: isLooksClear ? '#16a34a' : '#dc2626',
            }}>
              {result.recommendation}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => handleConfirm('ID Checked')}
              style={{ flex: 1, padding: '12px', background: '#1a2332' }}
            >
              ID Checked
            </button>
            <button
              onClick={() => handleConfirm('Not Needed')}
              style={{ flex: 1, padding: '12px', background: '#4b5563' }}
            >
              Not Needed
            </button>
            <button
              onClick={() => setResult(null)}
              style={{ padding: '12px 16px', background: 'none', color: '#6b7280', border: '1px solid #d1d5db' }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ScannerScreen;
