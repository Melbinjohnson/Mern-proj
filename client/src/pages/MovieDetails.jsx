import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Clock, Globe, Film, MapPin, Trash2, MessageSquare, X, Loader2 } from "lucide-react";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, reviewRes, showRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/movies/${id}`),
          axios.get(`http://localhost:3000/api/movies/${id}/reviews`),
          axios.get(`http://localhost:3000/api/shows/${id}`)
        ]);
        setMovie(movieRes.data.data);
        setReviews(reviewRes.data.data);
        setShows(showRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors pb-20">
      {/* 1. HERO HEADER */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-6xl mx-auto p-6 md:p-12 flex flex-col md:flex-row gap-10">
           <div className="w-full md:w-64 shrink-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-800">
              <img 
                src={movie.poster ? `http://localhost:3000${movie.poster}` : "https://via.placeholder.com/300x450"} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
           </div>
           
           <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter dark:text-white uppercase">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap gap-4">
                <Badge icon={<Film size={14} />} text={movie.genre} />
                <Badge icon={<Globe size={14} />} text={movie.language} />
                <Badge icon={<Clock size={14} />} text={`${movie.duration} min`} />
              </div>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl italic">
                {movie.description}
              </p>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        
        {/* 2. SHOWS SECTION (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TicketIcon className="text-red-600" /> Available Screenings
          </h2>

          {shows.length === 0 ? (
            <div className="p-10 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
               <p className="text-zinc-500">No shows scheduled for this movie yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {shows.map(show => (
                <div key={show._id} className="group bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-red-500 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-xl">{show.theaterId.name}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1 font-semibold text-red-500"><MapPin size={14}/> {show.theaterId.location}</span>
                      <span>{new Date(show.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {show.time}</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-400 mt-2 uppercase tracking-widest">Starting ₹{show.basePrice}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/show/${show._id}/seats`)}
                    className="bg-zinc-900 dark:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition active:scale-95 shadow-lg shadow-red-600/20"
                  >
                    Select Seats
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. COMPACT REVIEWS SECTION (Right 1/3) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <MessageSquare size={20} className="text-yellow-500" /> Reviews
            </h2>
            {token ? (
              <button onClick={() => setShowModal(true)} className="text-xs font-bold text-red-600 hover:underline">+ Add</button>
            ) : (
              <button onClick={() => navigate("/login")} className="text-xs font-bold text-zinc-500 underline">Login to review</button>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            {reviews.length === 0 && <p className="text-zinc-500 text-sm text-center py-4">Be the first to review!</p>}
            
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map(r => (
                <div key={r._id} className="space-y-2 group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold dark:text-zinc-200">{r.userName}</p>
                      <div className="flex text-yellow-500 text-[10px] mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < r.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    {r.userId === userId && (
                      <button 
                        onClick={() => handleDeleteReview(r._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Rate this Movie</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition"><X size={20}/></button>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button 
                        key={n} 
                        onClick={() => setRating(n)}
                        className={`w-10 h-10 rounded-lg font-bold transition ${rating === n ? 'bg-yellow-400 text-black' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
               </div>

               <textarea
                placeholder="How was your experience?"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-sm min-h-[120px] outline-none focus:ring-2 ring-red-500"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />

              <button
                disabled={!comment.trim()}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition shadow-lg shadow-red-600/20"
                onClick={handleSubmitReview}
              >
                Post Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper functions
  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(prev => prev.filter(rv => rv._id !== reviewId));
    } catch (err) { alert("Failed to delete review"); }
  }

  async function handleSubmitReview() {
    try {
      const res = await axios.post(`http://localhost:3000/api/movies/${id}/reviews`, 
        { rating: Number(rating), comment: comment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(prev => [res.data, ...prev]);
      setShowModal(false);
      setComment("");
      setRating(5);
    } catch (err) { alert(err.response?.data?.message || "Error adding review"); }
  }
};

const Badge = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
    {icon} {text}
  </div>
);

const TicketIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
);

export default MovieDetails;