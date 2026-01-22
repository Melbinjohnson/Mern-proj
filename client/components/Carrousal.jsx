import React, { useEffect, useState } from "react";
import axios from "axios";

const IMAGE_BASE = "http://localhost:3000";

export const Carrousal = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch latest 3 movies
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => {
        const latest = res.data.data
          .slice(-3)
          .reverse();
        setSlides(latest);
      })
      .catch(err => console.error(err));
  }, []);

  // Auto slide
  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrent(prev =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end px-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-500">
          Latest Movies
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {current + 1} / {slides.length}
        </span>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gray-200">
        <div
          className="flex transition-transform duration-1000"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(-${current * (100 / slides.length)}%)`,
          }}
        >
          {slides.map(movie => (
            <div
              key={movie._id}
              className="relative w-full h-[400px] md:h-[500px] flex-shrink-0"
              style={{ width: `${100 / slides.length}%` }}
            >
              <img
                src={
                  movie.poster
                    ? `${IMAGE_BASE}${movie.poster}`
                    : "https://via.placeholder.com/1200x500?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent flex items-center p-12">
                <div className="max-w-xl space-y-5">
                  <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm" style={{ "color": "gray" }}>
                    Featured
                  </p>

                  <h2 className="text-white text-5xl md:text-7xl font-black uppercase leading-none">
                    {movie.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
          <div
            className="h-full bg-yellow-400 transition-all duration-1000"
            style={{ width: `${((current + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
