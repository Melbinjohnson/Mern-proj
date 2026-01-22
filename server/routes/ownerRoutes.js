import express from "express";
import {
  addTheater,
  updateTheater,
  deleteTheater,
  addShow,
  updateShow,
  deleteShow,
  getShows,
  getMyTheaters,
  getTheaterById,
  getOwnerDashboardStats,
  getShowBookings,
  getOwnerReviews,
  getOwnerAllBookings,
  getOwnerTodayBookings
} from "../controllers/ownerControllers.js";

import auth from "../middlewares/authMiddlewares.js";
import owner from "../middlewares/ownerMiddlewares.js";

const ownerRouter = express.Router();

/* ===== THEATERS ===== */
ownerRouter.get("/theater", auth, owner, getMyTheaters);
ownerRouter.post("/theater", auth, owner, addTheater);
ownerRouter.put("/theater/:id", auth, owner, updateTheater);
ownerRouter.delete("/theater/:id", auth, owner, deleteTheater);
ownerRouter.get("/theater/:id", auth, owner, getTheaterById);

/* ===== SHOWS ===== */
ownerRouter.post("/show", auth, owner, addShow);
ownerRouter.put("/show/:id", auth, owner, updateShow);
ownerRouter.delete("/show/:id", auth, owner, deleteShow);
ownerRouter.get("/shows", auth, owner, getShows);
// routes/ownerRoutes.js
ownerRouter.get(
  "/shows/:showId/bookings",
  auth,
  owner,
  getShowBookings
);
ownerRouter.get(
  "/reviews",
  auth,
  owner,
  getOwnerReviews
);

// 📜 All-time bookings
ownerRouter.get("/bookings", auth, owner, getOwnerAllBookings);
// ownerRouter.get("/bookings",  getOwnerAllBookings);

// 📅 Today’s bookings
ownerRouter.get("/bookings/today", auth,
  owner, getOwnerTodayBookings);


  

ownerRouter.get("/dashboard-stats", auth, getOwnerDashboardStats);
export default ownerRouter;
