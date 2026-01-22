import express from "express";
import { addMovie, getOwners, deleteOwner, updateMovie, deleteMovie, getAllBookings,getAllReviewsAdmin } from "../controllers/adminControllers.js";
import auth from "../middlewares/authMiddlewares.js";
import admin from "../middlewares/adminMiddlewares.js";
import upload from "../middlewares/upload.js";


const adminRouter = express.Router();



// ===== USERS =====
adminRouter.get("/owners", auth, admin, getOwners);      // fetch owners only
adminRouter.delete("/owner/:id", auth, admin, deleteOwner); // delete owner
// ===== MOVIES =====
adminRouter.put("/movie/:id", auth, admin, upload.single("poster"), updateMovie);    
adminRouter.delete("/movie/:id", auth, admin, deleteMovie); // delete movie
adminRouter.post(
    "/movie",
    auth,
    admin,
    upload.single("poster"),
    addMovie
);
adminRouter.get(
    "/bookings-info",
    auth,
    admin,
    getAllBookings
);
adminRouter.get(
    "/reviews",
    auth,
    admin,
    getAllReviewsAdmin
  );
  
export default adminRouter;
