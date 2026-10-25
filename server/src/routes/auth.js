import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const makeToken = (user) => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '2h' });

router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8)
      return res.status(400).json({ message: 'Enter a name, valid email and password (at least 8 characters).' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'Email already registered.' });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user), user: { id: user._id, name, email, role: user.role } });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ message: 'Incorrect email or password.' });
    res.json({ token: makeToken(user), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (e) { next(e); }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));
export default router;
