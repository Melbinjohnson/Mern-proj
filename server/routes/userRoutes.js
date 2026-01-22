import express from "express";
import {
  getMovies,
getMovieById,
  getShowsByMovie,
  searchTheaters,
  getShowSeats,
  lockSeats,
  createBooking,
  getMyBookings,
  getMovieReviews,
  addReview,deleteReview
} from "../controllers/userControllers.js";

import auth from "../middlewares/authMiddlewares.js";

const userRouter = express.Router();

/* ===== BROWSING ===== */
userRouter.get("/movies", getMovies);
userRouter.get("/movies/:movieId", getMovieById);
userRouter.get("/shows/:movieId", getShowsByMovie);
userRouter.get("/search-theaters", searchTheaters);

/* ===== BOOKING FLOW ===== */
userRouter.get("/shows/:showId/seats", auth, getShowSeats);     // seating page
userRouter.post("/seats/lock", auth, lockSeats);                // select seats
userRouter.post("/bookings", auth, createBooking);              // dummy payment
userRouter.get("/bookings/me", auth, getMyBookings);            // user bookings



userRouter.get("/movies/:movieId/reviews", getMovieReviews);
userRouter.post(
  "/movies/:movieId/reviews",
  auth,
  addReview
);
userRouter.delete(
  "/reviews/:reviewId",
  auth,
  deleteReview
);

export default userRouter;
