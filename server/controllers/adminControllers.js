import Movie from "../models/movieModel.js";
import { User } from "../models/userModel.js";
import fs from "fs";
import Bookings from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";
import Show from "../models/showModel.js";




export const addMovie = async (req, res) => {
  const movie = await Movie.create({
    title: req.body.title,
    language: req.body.language,
    description: req.body.description,
    duration: req.body.duration,
    genre: req.body.genre,
    poster: req.file ? `/uploads/${req.file.filename}` : ""
  });

  res.status(201).json(movie);
};


export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

export const getOwners = async (req, res) => {
  const owners = await User.find({ role: "owner" }).select("-password");
  res.json(owners);
};
export const deleteOwner = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Owner deleted" });
};



export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Prepare update data
    const updateData = {
      title: req.body.title,
      language: req.body.language,
      description: req.body.description,
      duration: req.body.duration,
      genre: req.body.genre
    };

    // If new image uploaded
    if (req.file) {
      // Delete old image file
      if (movie.poster) {
        const oldPath = movie.poster.replace("/", "");
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }

      updateData.poster = `/uploads/${req.file.filename}`;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Delete image file if exists
    if (movie.poster) {
      const imagePath = movie.poster.replace("/", "");
      fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
    }

    await movie.deleteOne();

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find()
      .populate("user", "name email")
      .populate("theater", "name seatLayout") // 👈 IMPORTANT      
      .populate({
        path: "show",
        populate: {
          path: "movieId",
          select: "title"
        }
      })
      .sort({ createdAt: 1 });

    res.json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    // 1️⃣ Get all reviews with movie title
    const reviews = await Review.find()
      .populate("movie", "title")
      .sort({ createdAt: -1 })
      .lean();

    // 2️⃣ Get all shows with theater
    const shows = await Show.find()
      .populate("theaterId", "name")
      .lean();

    // 3️⃣ Map movieId -> theaterName
    const movieTheaterMap = {};
    shows.forEach(show => {
      if (show.movieId && show.theaterId) {
        movieTheaterMap[show.movieId.toString()] = show.theaterId.name;
      }
    });

    // 4️⃣ Attach theater name to reviews
    const finalReviews = reviews.map(r => ({
      ...r,
      theaterName: r.movie
        ? movieTheaterMap[r.movie._id.toString()] || "N/A"
        : "N/A",
    }));

    res.json({ data: finalReviews });
  } catch (error) {
    console.error("ADMIN REVIEW ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch admin reviews",
    });
  }
};
