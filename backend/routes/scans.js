import express from 'express';
import mongoose from 'mongoose';
import Scan from '../models/Scan.js';

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const scans = await Scan.find();
    res.status(200).json(scans);
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next) => {
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


router.delete('/:id', async (req, res, next) => {
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

export default router;