import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // HH:mm
      required: true,
    },
    basePrice: {
      type: Number,   // BASE PRICE
      required: true,
    },
  },
  { timestamps: true }
);

const Show = mongoose.model("Show", showSchema);
export default Show;

