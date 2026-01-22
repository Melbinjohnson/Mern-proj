import { useEffect, useState } from "react";
import axios from "axios";
import { Star, MessageSquare, Film, MapPin, User, Calendar, ShieldAlert } from "lucide-react";

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3000/api/admin/reviews", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => {
                setReviews(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching reviews", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-2 rounded-lg shadow-lg shadow-yellow-500/20">
                            <MessageSquare className="text-white" size={24} />
                        </div>
                        <h1 className="text-3xl font-bold dark:text-white">Global Reviews</h1>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Moderate and monitor all user-submitted feedback across the platform.</p>
                </header>

                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <ShieldAlert className="mx-auto mb-4 text-zinc-400" size={48} />
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg">No reviews found in the system.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((r) => (
                            <div 
                                key={r._id} 
                                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-yellow-500/50"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* User and Rating */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg dark:text-white">{r.userName}</h3>
                                            <StarRating rating={r.rating} />
                                        </div>
                                    </div>

                                    {/* Movie/Theater Context Badges */}
                                    <div className="flex flex-wrap gap-2 md:justify-end">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                            <Film size={12} /> {r.movie?.title}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                            <MapPin size={12} /> {r.theaterName}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                                        "{r.comment || "No text provided for this review."}"
                                    </p>
                                </div>

                                {/* Date and Analytics placeholder */}
                                <div className="mt-4 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-800 pt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Platform Data'}
                                    </div>
                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">ID: {r._id.slice(-6)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable Star Component
const StarRating = ({ rating }) => {
    return (
        <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    size={14} 
                    className={i < rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-300 dark:text-zinc-700"} 
                />
            ))}
        </div>
    );
};

export default AdminReviews;