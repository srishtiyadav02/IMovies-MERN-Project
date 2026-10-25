import { Router } from 'express';
import Movie from '../models/Movie.js';
import Booking from '../models/Booking.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.post('/movies', async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (e) { next(e); }
});
router.put('/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json(movie);
  } catch (e) { next(e); }
});
router.delete('/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ message: 'Movie deleted.' });
  } catch (e) { next(e); }
});
router.get('/bookings', async (_req, res, next) => {
  try { res.json(await Booking.find().populate('user', 'name email').populate('movie show').sort({ createdAt: -1 }).limit(500)); }
  catch (e) { next(e); }
});
export default router;
