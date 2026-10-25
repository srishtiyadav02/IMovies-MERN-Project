# IMovies — MERN Movie Ticket Booking System

A beginner-friendly MERN-stack capstone starter project with movie browsing, seat selection, booking confirmation, user registration/login, and a simple admin API.

## Tech stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + bcrypt

## Important
MongoDB does **not** need to be installed on your laptop. You can use MongoDB Atlas (cloud database) and put its connection string in `server/.env`.

This is a starter implementation. Run it locally, test all flows, and adapt it to the exact Skill Wallet workspace/user stories before submitting. Do not claim features are tested until you have tested them.

## Requirements
- Node.js and npm
- A MongoDB Atlas account (or local MongoDB)
- Git

## Setup

### 1. Set up MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/atlas/database
2. Create a database user and password.
3. In Network Access, allow your current IP address.
4. In your cluster, choose Connect → Drivers and copy the connection string.
5. Replace `<password>` and add the database name `imovies`, for example:
   `mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/imovies?retryWrites=true&w=majority`

Never share your connection string or commit it to GitHub.

### 2. Configure the backend
Open a terminal in `server`:
```bash
npm install
```
Copy `.env.example` to `.env`, then set `MONGODB_URI` and a long random `JWT_SECRET`.
```bash
npm run seed
npm run dev
```
Backend runs at http://localhost:5000

### 3. Configure the frontend
Open a second terminal in `client`:
```bash
npm install
npm run dev
```
Open the local URL Vite prints, usually http://localhost:5173

## Demo behaviour
- Browse sample movies and show details.
- Register/login to create bookings.
- Select seats and submit a booking.
- View the current user's bookings.
- Admin endpoints are protected; create an admin manually only after reading the notes below.

## Admin account
For safety, public registration always creates a regular user. To create an admin, use MongoDB Atlas UI to edit a trusted test user's `role` field to `admin`, or create a one-time local script yourself. Never expose an admin registration button in a public app.

## API overview
- `GET /api/health`
- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT)
- `GET /api/shows/:id/seats`
- `POST /api/bookings` (JWT)
- `GET /api/bookings/my` (JWT)
- `PATCH /api/bookings/:id/cancel` (JWT)
- `POST /api/admin/movies` (admin JWT)
- `PUT /api/admin/movies/:id` (admin JWT)
- `DELETE /api/admin/movies/:id` (admin JWT)
- `GET /api/admin/bookings` (admin JWT)

## Before submission
- Verify the Skill Wallet project workspace stories and mandatory templates.
- Test registration/login, booking, seat conflict handling and API errors.
- Add screenshots to the report.
- Record a demo video showing the running application.
- Upload code and report to GitHub only after removing secrets and checking `.gitignore`.
