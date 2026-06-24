import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req,res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/api/scans', (req, res) => {
  console.log('Scan received:', req.body);
  res.status(201).json({ message: 'Scan received' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
