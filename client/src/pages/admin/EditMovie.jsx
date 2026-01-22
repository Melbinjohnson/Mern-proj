import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Film, Upload, ArrowLeft, Save, Loader2, Clock, Globe, Tag } from "lucide-react";

const IMAGE_BASE = "http://localhost:3000";

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: "",
    language: "",
    description: "",
    duration: "",
    genre: "",
    poster: ""
  });

  const [newPoster, setNewPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/movies/${id}`)
      .then(res => {
        setMovie(res.data.data);
        setLoading(false);
      })
      .catch(err => console.error("Fetch failed", err));
  }, [id]);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("title", movie.title);
    formData.append("language", movie.language);
    formData.append("genre", movie.genre);
    formData.append("duration", movie.duration);
    formData.append("description", movie.description);

    if (newPoster) formData.append("poster", newPoster);

    try {
      await axios.put(
        `http://localhost:3000/api/admin/movie/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      navigate("/admin/movies");
    } catch (err) {
      alert("Failed to update movie");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition text-zinc-500"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold dark:text-white">Edit Movie Details</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Poster Upload */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Movie Poster</label>
              <div className="relative group">
                <img
                  src={
                    newPoster
                      ? URL.createObjectURL(newPoster)
                      : movie.poster
                      ? `${IMAGE_BASE}${movie.poster}`
                      : "https://via.placeholder.com/300x450?text=No+Poster"
                  }
                  alt="poster preview"
                  className="w-full aspect-[2/3] object-cover rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 group-hover:opacity-90 transition"
                />
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-2xl cursor-pointer text-white">
                  <Upload size={32} className="mb-2" />
                  <span className="font-bold text-sm">Upload New</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => setNewPoster(e.target.files[0])}
                  />
                </label>
              </div>
              <p className="mt-4 text-center text-xs text-zinc-500 italic">Recommended: 2:3 aspect ratio</p>
            </div>
          </div>

          {/* Right Column: Metadata Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="Movie Title" 
                  name="title" 
                  icon={<Film size={18} />}
                  value={movie.title} 
                  onChange={handleChange} 
                />
                <FormInput 
                  label="Genre" 
                  name="genre" 
                  icon={<Tag size={18} />}
                  value={movie.genre} 
                  onChange={handleChange} 
                />
                <FormInput 
                  label="Language" 
                  name="language" 
                  icon={<Globe size={18} />}
                  value={movie.language} 
                  onChange={handleChange} 
                />
                <FormInput 
                  label="Duration (mins)" 
                  name="duration" 
                  type="number"
                  icon={<Clock size={18} />}
                  value={movie.duration} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Synopsis / Description</label>
                <textarea
                  name="description"
                  rows="6"
                  value={movie.description}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 outline-none focus:ring-2 ring-red-500/50 transition resize-none text-zinc-700 dark:text-zinc-200"
                  placeholder="Enter a brief plot summary..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-70"
                >
                  {updating ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Movie</>}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-2xl font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Custom Themed Input Component
const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 ring-red-500/50 transition text-zinc-700 dark:text-zinc-200"
        required
      />
    </div>
  </div>
);

export default EditMovie;