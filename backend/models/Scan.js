import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
    estimatedAgeRange: { type: String, required: true },
    recommendation: { type: String, required: true },
    actionTaken: { type: String, required: true },
    staffId: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Scan', scanSchema);