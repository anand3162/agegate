import { useState, useEffect } from 'react';
import { auth } from '../firebase';

function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchScans() {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('http://localhost:3001/api/scans/mine', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setScans(data);
    } catch (err) {
      setError('Failed to load scan history.');
    } finally {
      setLoading(false);
    }
  }
  fetchScans();
}, []);


  return (
  <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
    <h2>Scan History</h2>
    {loading && <p>Loading...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {!loading && scans.length === 0 && <p>No scans yet.</p>}
    {scans.map((scan) => (
      <div key={scan._id} style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '12px', marginBottom: '12px' }}>
        <p>Age: {scan.estimatedAgeRange}</p>
        <p>Recommendation: {scan.recommendation}</p>
        <p>Action: {scan.actionTaken}</p>
        <p>Date: {new Date(scan.createdAt).toLocaleString()}</p>
      </div>
    ))}
  </div>
);

}

export default History;
