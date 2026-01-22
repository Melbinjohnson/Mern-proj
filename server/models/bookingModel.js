import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 🔹 Snapshot data (USED FOR UI)
  theaterDetails: {
    name: String,
    location: String,
  },

  showDetails: {
    date: String,
    time: String,
    movieName: String,
  },

  // 🔹 References (OPTIONAL – for admin logic)
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
    required: false,
  },

  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: false,
  },

  seats: [String],
  totalAmount: Number,

  paymentStatus: {
    type: String,
    enum: ["paid", "failed"],
    default: "paid",
  },

  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("bookings", bookingSchema);
