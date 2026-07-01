import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import Scan from './models/Scan.js';


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req,res) => {
    res.status(200).json({ status: 'ok' });
});

app.get("/api/scans", async (req, res) => {
  const scans = await Scan.find();
  res.status(200).json(scans);
});

app.post('/api/scans', async (req, res) => {
  const scan = new Scan({
  estimatedAgeRange: req.body.estimatedAgeRange,
  recommendation: req.body.recommendation,
  actionTaken: req.body.actionTaken,
  staffId: req.body.staffId,
  imageUrl: req.body.imageUrl,
});
  await scan.save();
  res.status(201).json(scan);
});

app.delete('/api/scans/:id', async (req, res) => {
  await Scan.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Scan deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
