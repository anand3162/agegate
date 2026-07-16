import express from 'express';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({
    uid: req.user.uid,
    email: req.user.email
  });
});

export default router;