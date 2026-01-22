import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Star, Play } from "lucide-react";

const IMAGE_BASE = "http://localhost:3000";

const MovieGrid = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => {
        setMovies(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <SkeletonGrid />;

  return (
    /* Changed grid-cols-2 to grid-cols-1 for mobile */
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
      {movies.map(movie => (
        <div
          key={movie._id}
          onClick={() => navigate(`/movie/${movie._id}`)}
          className="group relative flex flex-col cursor-pointer bg-white dark:bg-zinc-900/50 p-3 rounded-3xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none"
        >
          {/* Poster Container */}
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            <img
              src={movie.poster ? `${IMAGE_BASE}${movie.poster}` : "https://via.placeholder.com/300x450?text=No+Poster"}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
               <button className="flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Play size={14} className="fill-black" /> View Details
               </button>
            </div>

            <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-black text-white uppercase tracking-tighter">
              {movie.genre?.split(',')[0]}
            </div>
          </div>

          {/* Content Info */}
          <div className="mt-4 px-1 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-lg leading-tight dark:text-white group-hover:text-red-600 transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <span className="flex items-center gap-1 text-sm font-bold text-yellow-500 shrink-0">
                <Star size={14} className="fill-yellow-500" /> 4.5
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {movie.duration} min
                </span>
                <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full"></span>
                <span>{movie.language || "English"}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie._id}`);
              }}
              className="w-full mt-2 bg-red-600 dark:bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-4 animate-pulse p-3 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
        <div className="aspect-[2/3] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
        </div>
        <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full" />
      </div>
    ))}
  </div>
);

export default MovieGrid;