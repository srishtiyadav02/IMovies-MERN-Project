import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import Show from './models/Show.js';

const samples = [
  { title: 'The Sky Beyond', description: 'A young astronomer discovers a mystery among the stars.', genre: 'Sci-Fi', language: 'English', duration: 128, rating: 8.2, posterUrl: 'https://placehold.co/400x600/172554/ffffff?text=The+Sky+Beyond' },
  { title: 'City of Dreams', description: 'An aspiring musician finds her voice in a bustling city.', genre: 'Drama', language: 'Hindi', duration: 116, rating: 7.8, posterUrl: 'https://placehold.co/400x600/4c1d95/ffffff?text=City+of+Dreams' },
  { title: 'The Last Heist', description: 'A retired detective is pulled into one final mystery.', genre: 'Thriller', language: 'English', duration: 121, rating: 7.6, posterUrl: 'https://placehold.co/400x600/7f1d1d/ffffff?text=The+Last+Heist' },
  { title: 'Laughing Matters', description: 'Friends turn a chaotic road trip into a life-changing adventure.', genre: 'Comedy', language: 'Hindi', duration: 109, rating: 8.0, posterUrl: 'https://placehold.co/400x600/713f12/ffffff?text=Laughing+Matters' }
];
try {
  await mongoose.connect(process.env.MONGODB_URI);
  await Movie.deleteMany({ title: { $in: samples.map(m => m.title) } });
  const movies = await Movie.insertMany(samples);
  const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  await Show.deleteMany({ movie: { $in: movies.map(m => m._id) }, date });
  const shows = movies.flatMap(movie => ['12:00', '15:30', '19:00'].map(time => ({
    movie: movie._id, date, time, price: 180, bookedSeats: []
  })));
  await Show.insertMany(shows);
  console.log(`Seeded ${movies.length} movies and ${shows.length} shows.`);
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
