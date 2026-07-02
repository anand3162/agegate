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

app.get("/api/scans", async (req, res, next) => {
  try {
    const scans = await Scan.find();
    res.status(200).json(scans);
  } catch (err) {
    next(err);
  }
});


app.post('/api/scans', async (req, res, next) => {
  if (!req.body.estimatedAgeRange || !req.body.recommendation || !req.body.actionTaken || !req.body.staffId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const scan = new Scan({
      estimatedAgeRange: req.body.estimatedAgeRange,
      recommendation: req.body.recommendation,
      actionTaken: req.body.actionTaken,
      staffId: req.body.staffId,
      imageUrl: req.body.imageUrl,
    });
    await scan.save();
    res.status(201).json(scan);
  } catch (err) {
    next(err);
  }
});


app.delete('/api/scans/:id', async (req, res, next) => {
  if (!/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  try {
    const deleted = await Scan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.status(200).json({ message: 'Scan deleted' });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
