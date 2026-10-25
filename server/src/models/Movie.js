import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  genre: { type: String, default: 'Drama' },
  language: { type: String, default: 'Hindi' },
  duration: { type: Number, default: 120, min: 1 },
  rating: { type: Number, default: 8, min: 0, max: 10 },
  posterUrl: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('Movie', movieSchema);
