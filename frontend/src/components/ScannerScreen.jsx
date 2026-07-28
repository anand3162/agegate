import { useState } from 'react';

function ScannerScreen() {
    const [result, setResult] = useState(null);

    function handleScan() {
        setResult({         
        ageRange: '22-26',
        recommendation: 'Check ID'
    });
    }

    return (
        <div>
            <h2>Ready to Scan</h2>
            <button onClick={handleScan}>Scan</button>
            {result && (
                <button onClick={() => setResult(null)}>Reset</button>
            )}
            {result && (
                <div>
                    <p>Estimated Age: {result.ageRange}</p>
                    <p>Recommendation: {result.recommendation}</p>
                </div>
            )}
        </div>
    );
}
export default ScannerScreen;