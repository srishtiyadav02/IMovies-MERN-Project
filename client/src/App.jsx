import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import api from './api';

const demoMovies = [
  { _id: 'demo1', title: 'The Sky Beyond', description: 'A young astronomer discovers a mystery among the stars.', genre: 'Sci-Fi', language: 'English', duration: 128, rating: 8.2, posterUrl: 'https://placehold.co/400x600/172554/ffffff?text=The+Sky+Beyond' },
  { _id: 'demo2', title: 'City of Dreams', description: 'An aspiring musician finds her voice in a bustling city.', genre: 'Drama', language: 'Hindi', duration: 116, rating: 7.8, posterUrl: 'https://placehold.co/400x600/4c1d95/ffffff?text=City+of+Dreams' },
  { _id: 'demo3', title: 'The Last Heist', description: 'A retired detective is pulled into one final mystery.', genre: 'Thriller', language: 'English', duration: 121, rating: 7.6, posterUrl: 'https://placehold.co/400x600/7f1d1d/ffffff?text=The+Last+Heist' },
  { _id: 'demo4', title: 'Laughing Matters', description: 'Friends turn a chaotic road trip into a life-changing adventure.', genre: 'Comedy', language: 'Hindi', duration: 109, rating: 8.0, posterUrl: 'https://placehold.co/400x600/713f12/ffffff?text=Laughing+Matters' }
];
function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('imovies_user')); } catch { return null; } });
  const [movies, setMovies] = useState(demoMovies);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => { api.get('/movies').then(r => setMovies(r.data)).catch(() => {}); }, []);
  const logout = () => { localStorage.removeItem('imovies_token'); localStorage.removeItem('imovies_user'); setUser(null); setNotice('You have signed out.'); };
  return <div className="app-shell">
    <header className="nav"><Link className="brand" to="/">✦ IMOVIES</Link><nav><NavLink to="/">Home</NavLink><NavLink to="/bookings">My Bookings</NavLink>{user ? <button className="nav-button" onClick={logout}>Sign out</button> : <NavLink to="/login">Sign in</NavLink>}</nav></header>
    {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}
    <Routes>
      <Route path="/" element={<Home movies={movies} query={query} setQuery={setQuery} />} />
      <Route path="/movies/:id" element={<MoviePage movies={movies} user={user} />} />
      <Route path="/login" element={<Auth mode="login" setUser={setUser} />} />
      <Route path="/register" element={<Auth mode="register" setUser={setUser} />} />
      <Route path="/bookings" element={<Bookings user={user} />} />
      <Route path="*" element={<main className="container"><h2>Page not found</h2><Link to="/">Return home</Link></main>} />
    </Routes>
    <footer>© {new Date().getFullYear()} IMovies · Your next story starts here.</footer>
  </div>;
}
function Home({ movies, query, setQuery }) {
  const shown = movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
  return <><section className="hero"><div className="hero-copy"><p className="eyebrow">YOUR SEAT. YOUR STORY.</p><h1>Big stories.<br/><span>Big screen.</span></h1><p>Find your next favourite film and make it a movie night.</p><a className="primary" href="#movies">Explore movies <span>↗</span></a></div><div className="hero-art"><div className="orb">▶</div><div className="floating-card">NOW SHOWING <b>✦ IMOVIES</b></div></div></section>
  <main className="container" id="movies"><div className="section-head"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Now showing</h2></div><input aria-label="Search movies" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies..." /></div>
  <div className="movie-grid">{shown.map(m => <article className="movie-card" key={m._id}><Link to={`/movies/${m._id}`} className="poster-wrap"><img src={m.posterUrl || `https://placehold.co/400x600/172554/ffffff?text=${encodeURIComponent(m.title)}`} alt={`${m.title} poster`} /><span className="poster-cta">View movie ↗</span></Link><div className="movie-info"><div className="movie-meta"><span>{m.genre}</span><span>★ {m.rating}</span></div><h3>{m.title}</h3><p>{m.language} · {m.duration} min</p><Link className="book-link" to={`/movies/${m._id}`}>Book tickets <span>→</span></Link></div></article>)}</div>
  {!shown.length && <p className="empty">No movies match your search.</p>}</main></>;
}
function MoviePage({ movies, user }) {
  const { id } = useParams(); const navigate = useNavigate();
  const movie = movies.find(m => m._id === id);
  const [shows, setShows] = useState([]); const [selected, setSelected] = useState('');
  const [seats, setSeats] = useState([]); const [busySeats, setBusySeats] = useState([]); const [message, setMessage] = useState('');
  useEffect(() => { if (!id.startsWith('demo')) api.get(`/shows/for-movie/${id}`).then(r => { setShows(r.data); if (r.data[0]) setSelected(r.data[0]._id); }).catch(() => {}); }, [id]);
  useEffect(() => { if (selected) api.get(`/shows/${selected}/seats`).then(r => setBusySeats(r.data.bookedSeats || [])).catch(() => setBusySeats([])); }, [selected]);
  if (!movie) return <main className="container"><h2>Loading movie…</h2><p>If this remains, return home and select a movie.</p><Link to="/">Home</Link></main>;
  const seatIds = Array.from({ length: 64 }, (_, i) => `${String.fromCharCode(65 + Math.floor(i / 8))}${i % 8 + 1}`);
  const show = shows.find(s => s._id === selected);
  const toggle = seat => setSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : prev.length < 8 ? [...prev, seat] : prev);
  async function book() {
    setMessage('');
    if (!user) { navigate('/login'); return; }
    if (!selected || !seats.length) { setMessage('Select a show and at least one seat.'); return; }
    try {
      const r = await api.post('/bookings', { showId: selected, seats });
      setMessage(`Booking confirmed! Reference: ${r.data.reference}. Total: ₹${r.data.totalPrice}`);
      setSeats([]); const fresh = await api.get(`/shows/${selected}/seats`); setBusySeats(fresh.data.bookedSeats || []);
    } catch (e) { setMessage(e.response?.data?.message || 'Could not book. Make sure the backend and database are running.'); }
  }
  return <main className="container movie-detail"><Link to="/" className="back-link">← All movies</Link><div className="detail-layout"><img className="detail-poster" src={movie.posterUrl} alt={`${movie.title} poster`} /><div className="detail-copy"><p className="eyebrow">{movie.genre} · {movie.language}</p><h1>{movie.title}</h1><p className="rating">★ {movie.rating} <span>· {movie.duration} minutes</span></p><p>{movie.description}</p><h3>Choose a show</h3>
  {shows.length ? <div className="show-list">{shows.map(s => <button key={s._id} className={`show-chip ${selected === s._id ? 'active' : ''}`} onClick={() => { setSelected(s._id); setSeats([]); }}>{s.date} · {s.time} · ₹{s.price}</button>)}</div> : <p className="muted">Shows appear after the database is configured and seeded.</p>}
  {show && <><h3>Select seats <small>(maximum 8)</small></h3><div className="screen">SCREEN THIS WAY</div><div className="seat-grid">{seatIds.map(seat => <button key={seat} disabled={busySeats.includes(seat)} className={`seat ${busySeats.includes(seat) ? 'booked' : seats.includes(seat) ? 'selected' : ''}`} onClick={() => toggle(seat)} aria-label={`Seat ${seat}`}>{seat}</button>)}</div><div className="seat-legend"><span>Available</span><span>Selected</span><span>Booked</span></div><p>{seats.length} seats · Total ₹{seats.length * show.price}</p><button className="primary" onClick={book}>Confirm booking</button></>}
  {message && <p className="message" role="status">{message}</p>}</div></div></main>;
}
function Auth({ mode, setUser }) {
  const navigate = useNavigate(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setError(''); setBusy(true); try { const r = await api.post(`/auth/${mode}`, { name, email, password }); localStorage.setItem('imovies_token', r.data.token); localStorage.setItem('imovies_user', JSON.stringify(r.data.user)); setUser(r.data.user); navigate('/'); } catch (e) { setError(e.response?.data?.message || 'Cannot connect to the API. Start the server and configure MongoDB Atlas.'); } finally { setBusy(false); } }
  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}><p className="eyebrow">WELCOME TO IMOVIES</p><h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>{mode === 'register' && <label>Full name<input value={name} onChange={e => setName(e.target.value)} required minLength="2" /></label>}<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="8" /></label>{error && <p className="error">{error}</p>}<button className="primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}</button><p className="switch-auth">{mode === 'login' ? <>New here? <Link to="/register">Create an account</Link></> : <>Already registered? <Link to="/login">Sign in</Link></>}</p></form></main>;
}
function Bookings({ user }) {
  const [items, setItems] = useState([]); const [message, setMessage] = useState('');
  useEffect(() => { if (user) api.get('/bookings/my').then(r => setItems(r.data)).catch(e => setMessage(e.response?.data?.message || 'Could not load bookings.')); }, [user]);
  async function cancel(id) { try { await api.patch(`/bookings/${id}/cancel`); setItems(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b)); } catch (e) { setMessage(e.response?.data?.message || 'Cancellation failed.'); } }
  if (!user) return <main className="container"><h1>My bookings</h1><p>Please <Link to="/login">sign in</Link> to view your bookings.</p></main>;
  return <main className="container bookings-page"><p className="eyebrow">YOUR MOVIE NIGHTS</p><h1>My bookings</h1>{message && <p className="message">{message}</p>}{!items.length && <p className="muted">No bookings yet. Pick a movie to get started.</p>}{items.map(b => <article className="booking-row" key={b._id}><div><b>{b.movie?.title || 'Movie'}</b><p>{b.show?.date} · {b.show?.time} · Seats {b.seats?.join(', ')}</p><small>Ref: {b.reference} · {b.status}</small></div><div><strong>₹{b.totalPrice}</strong>{b.status === 'confirmed' && <button className="text-button" onClick={() => cancel(b._id)}>Cancel booking</button>}</div></article>)}</main>;
}
export default App;
