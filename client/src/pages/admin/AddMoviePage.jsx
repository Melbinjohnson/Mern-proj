import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Film, Image as ImageIcon, Clock, Globe, Tag, Save, ArrowLeft, Loader2 } from "lucide-react";

const AddMovie = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [posterPreview, setPosterPreview] = useState(null);
    const [movie, setMovie] = useState({
        title: "",
        language: "",
        description: "",
        duration: "",
        genre: "",
        poster: null
    });

    const handleChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMovie({ ...movie, poster: file });
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
      
        Object.keys(movie).forEach(key => {
          formData.append(key, movie[key]);
        });
      
        try {
            await axios.post(
                "http://localhost:3000/api/admin/movie",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            navigate("/admin/movies");
        } catch (err) {
            alert("Error adding movie. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition text-zinc-500"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold dark:text-white">Upload New Movie</h1>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Poster Upload Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 block">Movie Poster</label>
                            
                            <div className="relative group aspect-[2/3] w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-red-500">
                                {posterPreview ? (
                                    <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon className="mx-auto text-zinc-400 mb-2" size={40} />
                                        <p className="text-xs text-zinc-500 font-medium">Click to upload poster</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="mt-4 text-[10px] text-zinc-400 text-center italic uppercase">High resolution 2:3 ratio recommended</p>
                        </div>
                    </div>

                    {/* Form Details Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Movie Title" name="title" icon={<Film size={18}/>} placeholder="e.g. Inception" value={movie.title} onChange={handleChange} />
                                <FormInput label="Genre" name="genre" icon={<Tag size={18}/>} placeholder="e.g. Sci-Fi, Action" value={movie.genre} onChange={handleChange} />
                                <FormInput label="Language" name="language" icon={<Globe size={18}/>} placeholder="e.g. English" value={movie.language} onChange={handleChange} />
                                <FormInput label="Duration (Mins)" name="duration" type="number" icon={<Clock size={18}/>} placeholder="e.g. 148" value={movie.duration} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Synopsis / Storyline</label>
                                <textarea
                                    name="description"
                                    rows="5"
                                    value={movie.description}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 outline-none focus:ring-2 ring-red-500/50 transition resize-none text-zinc-700 dark:text-zinc-200"
                                    placeholder="Briefly describe the movie plot..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Movie</>}
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

const FormInput = ({ label, icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                {icon}
            </div>
            <input
                {...props}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 ring-red-500/50 transition text-zinc-700 dark:text-zinc-200"
            />
        </div>
    </div>
);

export default AddMovie;