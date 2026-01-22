import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true, // A1, B3
  },
  price: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false, 
  },
});

const Seat = mongoose.model("Seat", seatSchema);
export default Seat;
