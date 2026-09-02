import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchScans() {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scans/mine`, {
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
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a2332' }}>Scan History</h2>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>{scans.length} record{scans.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => navigate('/scanner')} style={{ background: 'none', color: '#1a2332', border: '1px solid #d1d5db', fontSize: '13px', padding: '8px 14px' }}>
          ← Scanner
        </button>
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!loading && scans.length === 0 && (
        <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '60px' }}>No scans recorded yet.</p>
      )}

      {scans.slice().reverse().map((scan) => (
        <div key={scan._id} style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          borderLeft: `4px solid ${scan.recommendation === 'Looks Clear' ? '#16a34a' : '#dc2626'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                Age range: {scan.estimatedAgeRange}
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>Action: {scan.actionTaken}</p>
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
              borderRadius: '20px',
              background: scan.recommendation === 'Looks Clear' ? '#dcfce7' : '#fee2e2',
              color: scan.recommendation === 'Looks Clear' ? '#16a34a' : '#dc2626',
            }}>
              {scan.recommendation}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
            {new Date(scan.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default History;
