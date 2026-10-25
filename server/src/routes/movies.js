import { Router } from 'express';
import Movie from '../models/Movie.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.q) filter.title = { $regex: String(req.query.q).slice(0, 80), $options: 'i' };
    if (req.query.genre && req.query.genre !== 'All') filter.genre = req.query.genre;
    res.json(await Movie.find(filter).sort({ title: 1 }).limit(100));
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json(movie);
  } catch (e) { next(e); }
});
export default router;
