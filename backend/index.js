import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import Scan from './models/Scan.js';
import scanRoutes from './routes/scans.js';



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req,res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/scans', scanRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
