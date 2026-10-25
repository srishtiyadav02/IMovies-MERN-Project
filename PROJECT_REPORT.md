# IMovies — Movie Ticket Booking System

> Draft report template. Replace bracketed text with your details and record only tests you actually performed.

## Cover page
- Student name: Srishti Yadav
- Programme: B.Tech CSE
- Institution: Lakshmi Narain College of Technology And Science
- Course: Full Stack Development — MERN Stack
- Project: IMovies — Movie Ticket Booking System
- Date: 26/10/2026

## Abstract
IMovies is a web application prototype for browsing movies and booking cinema seats online. It uses React for the user interface, Express and Node.js for REST APIs, and MongoDB for data storage. Users can register, sign in, browse movies, select seats, create bookings and review their booking history.

## Problem statement
Manual movie-ticket booking can require users to visit a counter or use disconnected processes. A web-based interface can present movie information and booking details in one place.

## Objectives
1. Build a responsive movie listing interface.
2. Provide secure registration and login.
3. Store movies, shows and bookings in a database.
4. Let users choose seats and view booking confirmation.
5. Provide basic administrative movie-management APIs.

## Proposed system
The frontend communicates with a REST API. The API validates requests, authenticates users with JWT, and reads/writes MongoDB documents through Mongoose.

## Technology stack
- React and Vite
- CSS
- Node.js and Express
- MongoDB and Mongoose
- bcryptjs for password hashing
- JSON Web Tokens for authentication

## Main modules
1. Movie catalogue and search
2. User registration/login
3. Show and seat availability
4. Booking and booking history
5. Admin movie management

## Database design
- **User**: name, email, password hash, role
- **Movie**: title, description, genre, language, duration, rating, poster URL
- **Show**: movie, date, time, price, booked seat identifiers
- **Booking**: user, show, movie, seats, total price, status, booking reference

## Security considerations
Passwords are hashed, JWT secrets are stored in environment variables, user booking routes require authentication, and admin routes require the admin role. This project does not collect payment-card details.

## Testing

| Test | Expected Result | Actual Result |
|---|---|---|
| Register with valid details | Account created successfully | Passed — account created during local testing |
| Login with correct credentials | Login succeeds and JWT is returned | Passed — login worked during local testing |
| Browse movies | Movie list appears | Passed — movie list displayed during local testing |
| Book available seats | Booking is saved successfully | Passed — booking worked during local testing |
| Rebook the same seats for the same show | Duplicate booking request is rejected | Pending — not tested yet |
| Regular user accesses the admin API | Access is denied with HTTP 403 Forbidden | Pending — not tested yet |

## Limitations
- No real payment integration.
- Sample movie/show data is for demonstration.
- Deployment and production hardening are not included.
- Booking race conditions should be reviewed carefully for a production system.

## Future enhancements
- Theatre selection, real payment provider, email notifications, ratings, accessibility improvements and richer analytics.

## Conclusion
IMovies demonstrates a full-stack workflow from React UI to REST APIs and MongoDB. The final report should be updated after the app has been run, tested, and aligned with the official capstone requirements.

## References
- React: https://react.dev/
- Express: https://expressjs.com/
- MongoDB Atlas: https://www.mongodb.com/atlas/database
- Mongoose: https://mongoosejs.com/
- Node.js: https://nodejs.org/
