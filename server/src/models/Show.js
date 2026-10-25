import mongoose from 'mongoose';
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  bookedSeats: { type: [String], default: [] }
}, { timestamps: true });
showSchema.index({ movie: 1, date: 1, time: 1 }, { unique: true });
export default mongoose.model('Show', showSchema);
