import { Router } from 'express';
import crypto from 'node:crypto';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const showId = String(req.body.showId || '');
    const seats = [...new Set(Array.isArray(req.body.seats) ? req.body.seats.map(String) : [])];
    if (!showId || seats.length < 1 || seats.length > 8)
      return res.status(400).json({ message: 'Choose between 1 and 8 seats.' });
    const validSeat = /^[A-H]([1-8])$/;
    if (!seats.every(s => validSeat.test(s))) return res.status(400).json({ message: 'Invalid seat selection.' });

    // Atomic condition prevents two requests from claiming a seat already booked.
    const show = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: seats } },
      { $addToSet: { bookedSeats: { $each: seats } } },
      { new: true }
    );
    if (!show) return res.status(409).json({ message: 'One or more seats were just booked. Refresh seat availability.' });

    try {
      const booking = await Booking.create({
        reference: `IM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        user: req.user._id, movie: show.movie, show: show._id, seats,
        totalPrice: show.price * seats.length, status: 'confirmed'
      });
      res.status(201).json(await booking.populate('movie show'));
    } catch (e) {
      await Show.updateOne({ _id: show._id }, { $pull: { bookedSeats: { $in: seats } } });
      throw e;
    }
  } catch (e) { next(e); }
});

router.get('/my', requireAuth, async (req, res, next) => {
  try {
    res.json(await Booking.find({ user: req.user._id }).populate('movie show').sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.patch('/:id/cancel', requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id, status: 'confirmed' });
    if (!booking) return res.status(404).json({ message: 'Active booking not found.' });
    booking.status = 'cancelled';
    await booking.save();
    await Show.updateOne({ _id: booking.show }, { $pull: { bookedSeats: { $in: booking.seats } } });
    res.json(booking);
  } catch (e) { next(e); }
});
export default router;
