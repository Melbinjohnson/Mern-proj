import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    language: String,
    description:String,
    duration: Number,
    genre: String,
    poster: String   
  },
  { timestamps: true }
);

const Movie= mongoose.model("Movie", movieSchema);

export default Movie;
