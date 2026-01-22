import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seatLayout: [
      {
        row: { type: String },        // A, B, C
        seatCount: { type: Number },  // number of seats in that row
        price: { type: Number },      // price per seat in that row
      },
    ],
  },
  { timestamps: true }
);

const Theater = mongoose.model("Theater", theaterSchema);
export default Theater;
