import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search as SearchIcon, MapPin, Calendar, Clock, Ticket, Loader2 } from "lucide-react";

const Search = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search).get("q");
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/search-theaters?query=${query}`)
      .then(res => {
        setShows(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [query]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-yellow-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-3 text-zinc-500">
            <SearchIcon size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Search Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            Showing results for: <span className="text-yellow-500">"{query}"</span>
          </h1>
        </header>

        {shows.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <Ticket className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" size={60} />
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">No screenings found</p>
            <p className="text-zinc-400 text-sm">Try searching for a different movie or theater.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {shows.map(show => (
              <div
                key={show._id}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-yellow-500/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-black dark:text-white group-hover:text-yellow-500 transition-colors">
                    {show.movieId.title}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                      <MapPin size={16} className="text-red-500" />
                      {show.theaterId.name} • {show.theaterId.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300">
                      <Calendar size={14} /> {new Date(show.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300">
                      <Clock size={14} /> {show.time}
                    </span>
                  </div>
                </div>

                {/* Right: Price & Action */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100 dark:border-zinc-800">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Starting from</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white">₹{show.basePrice}</p>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/show/${show._id}/seats`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-zinc-900 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-yellow-400/20 active:scale-95"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;