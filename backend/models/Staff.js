import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true },
    staffName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Staff', staffSchema);