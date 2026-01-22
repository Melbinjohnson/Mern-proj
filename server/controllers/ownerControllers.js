import Theater from "../models/theatreModel.js";
import Show from "../models/showModel.js";
import Seat from "../models/seatModel.js";
import Booking from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";

export const getMyTheaters = async (req, res) => {
  const theaters = await Theater.find({ ownerId: req.user.id });
  res.json(theaters);
};

export const getOwnerDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // 1. Get all theater IDs owned by this user
    const theaters = await Theater.find({ ownerId }).distinct("_id");
    
    // 2. Format "Today" string to match your DB (YYYY-MM-DD)
    const todayStr = new Date().toLocaleDateString('en-CA'); 

    // 3. Today's Range for createdAt (Timestamp based)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 4. Use Aggregation for Today's Stats
    // This finds bookings for owner's theaters where show date is today
    const todaysStatsRaw = await Booking.aggregate([
      {
        $match: {
          theater: { $in: theaters },
          "showDetails.date": todayStr, // Match the String date
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: null,
          bookingsCount: { $sum: 1 },
          seatsBooked: { $sum: { $size: "$seats" } },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // 5. Use Aggregation for All-Time Stats
    const allTimeStatsRaw = await Booking.aggregate([
      {
        $match: {
          theater: { $in: theaters },
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: null,
          bookingsCount: { $sum: 1 },
          seatsBooked: { $sum: { $size: "$seats" } },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // 6. Get Count of Shows Today
    const showsTodayCount = await Show.countDocuments({
      theaterId: { $in: theaters },
      date: todayStr // Adjust this if your Show model also uses Date objects
    });

    // Extract values or default to 0 if no bookings found
    const todaysStats = todaysStatsRaw[0] || { bookingsCount: 0, seatsBooked: 0, revenue: 0 };
    const allTimeStats = allTimeStatsRaw[0] || { bookingsCount: 0, seatsBooked: 0, revenue: 0 };

    res.json({
      totalTheaters: theaters.length,
      showsToday: showsTodayCount,
      todaysStats: {
        bookings: todaysStats.bookingsCount,
        seatsBooked: todaysStats.seatsBooked,
        revenue: todaysStats.revenue
      },
      allTimeStats: {
        bookings: allTimeStats.bookingsCount,
        seatsBooked: allTimeStats.seatsBooked,
        revenue: allTimeStats.revenue
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addTheater = async (req, res) => {
  try {
    const { name, location, seatLayout } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Theater name and location are required",
      });
    }

    if (!seatLayout || seatLayout.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Seat layout is required",
      });
    }

    // sanitize seat layout
    const formattedSeatLayout = seatLayout.map((row) => ({
      row: row.row.toUpperCase(),
      seatCount: Number(row.seatCount),
      price: Number(row.price),
    }));

    const theater = await Theater.create({
      name,
      location,
      seatLayout: formattedSeatLayout,
      ownerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Theater added successfully",
      data: theater,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add theater",
      error: error.message,
    });
  }
};


export const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json(theater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json({ message: "Theater deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getTheaterById = async (req, res) => {
  const theater = await Theater.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });

  if (!theater) {
    return res.status(404).json({ message: "Theater not found" });
  }

  res.json(theater);
};

export const addShow = async (req, res) => {
  try {
    const { movieId, theaterId, date, time, basePrice } = req.body;

    // 1️⃣ Verify theater belongs to owner
    const theater = await Theater.findOne({
      _id: theaterId,
      ownerId: req.user.id,
    });

    if (!theater) {
      return res.status(403).json({
        message: "You do not own this theater",
      });
    }

    // 2️⃣ Create show (NO seats field)
    const show = await Show.create({
      movieId,
      theaterId,
      date,
      time,
      basePrice,
    });

    // 3️⃣ Create seats for this show
    const seatDocs = [];

    theater.seatLayout.forEach((row) => {
      for (let i = 1; i <= row.seatCount; i++) {
        seatDocs.push({
          theater: theater._id,
          show: show._id,
          seatNumber: `${row.row}${i}`,
          price: row.price ?? basePrice, // 👈 fallback
          isBooked: false,
          isLocked: false,
        });
      }
    });

    await Seat.insertMany(seatDocs);

    res.status(201).json({
      message: "Show created and seats generated successfully",
      data: show,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create show",
      error: error.message,
    });
  }
};
export const getShowBookings = async (req, res) => {
  const { showId } = req.params;

  const bookings = await Booking.find({ show: showId })
    .populate("user", "name email")
    .select("seats totalAmount createdAt");

  res.json(bookings);
};
export const updateShow = async (req, res) => {
  try {
    const { basePrice, date, time } = req.body;

    const show = await Show.findOneAndUpdate(
      { _id: req.params.id },
      { basePrice, date, time },
      { new: true }
    );

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    await Seat.deleteMany({ show: show._id });

    res.json({ message: "Show and seats deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getShows = async (req, res) => {
  const shows = await Show.find()
    .populate("theaterId", "name location")
    .populate("movieId", "title")
    .select("movieId theaterId date time basePrice");

  res.json(shows);
};
export const getOwnerReviews = async (req, res) => {
  try {
    const theaters = await Theater.find({ ownerId: req.user.id }).select("_id");

    const shows = await Show.find({
      theaterId: { $in: theaters.map(t => t._id) }
    }).populate("movieId theaterId");

    const movieMap = {};
    shows.forEach(s => {
      movieMap[s.movieId._id] = s.theaterId.name;
    });

    const reviews = await Review.find({
      movie: { $in: Object.keys(movieMap) }
    })
      .populate("movie", "title")
      .lean();

    reviews.forEach(r => {
      r.theaterName = movieMap[r.movie._id] || "N/A";
    });

    res.json({ data: reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getOwnerAllBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const bookings = await Booking.find({
      "theater": { $in: await Theater.find({ ownerId: ownerId }).distinct("_id") }
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getOwnerTodayBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Use Locale Date String to match your "YYYY-MM-DD" or "DD/MM/YYYY" format
    // Ensure this matches exactly how you save 'showDetails.date' during booking
    const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' outputs YYYY-MM-DD

    // 1. Get all theater IDs owned by this user
    const ownerTheaters = await Theater.find({ ownerId }).distinct("_id");

    // 2. Query bookings
    const bookings = await Booking.find({
      theater: { $in: ownerTheaters },
      "showDetails.date": today,
      paymentStatus: "paid" // Good practice to only show successful ones
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ 
      data: bookings,
      meta: {
        queryDate: today, // Send this back so you can debug in frontend console
        count: bookings.length
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};