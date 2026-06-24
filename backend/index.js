import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req,res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/scans', (req, res) => {
    res.status(200).json([
  { "staffId": "test123", "estimatedAge": "22-26", "recommendation": "Check ID" },
  { "staffId": "test123", "estimatedAge": "34-38", "recommendation": "Looks Clear" }
]
);
});

app.post('/api/scans', (req, res) => {
  console.log('Scan received:', req.body);
  res.status(201).json({ message: 'Scan received' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
