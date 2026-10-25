import { Router } from 'express';
import Show from '../models/Show.js';
const router = Router();
router.get('/for-movie/:movieId', async (req, res, next) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId }).sort({ date: 1, time: 1 });
    res.json(shows);
  } catch (e) { next(e); }
});
router.get('/:id/seats', async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).select('bookedSeats price date time');
    if (!show) return res.status(404).json({ message: 'Show not found.' });
    const allSeats = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => `${String.fromCharCode(65 + row)}${col + 1}`)).flat();
    res.json({ ...show.toObject(), seats: allSeats.map(seat => ({ seat, booked: show.bookedSeats.includes(seat) })) });
  } catch (e) { next(e); }
});
export default router;
