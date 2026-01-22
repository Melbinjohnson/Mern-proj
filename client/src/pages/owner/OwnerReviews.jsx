import { useEffect, useState } from "react";
import axios from "axios";
import { Star, MessageSquare, Film, MapPin, User } from "lucide-react";

const OwnerReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/owner/reviews", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => setReviews(res.data.data))
            .catch(err => console.error("Error fetching reviews", err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-red-600">Customer Reviews</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">See what viewers are saying about their experience at your theaters.</p>
                </header>

                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                        <MessageSquare className="mx-auto mb-4 text-zinc-400" size={48} />
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg">No reviews yet.</p>
                        <p className="text-sm text-zinc-400">Reviews from your customers will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((r) => (
                            <div 
                                key={r._id} 
                                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold dark:text-white">{r.userName}</p>
                                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                <StarRating rating={r.rating} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-end gap-1">
                                            <Film size={12} /> {r.movie?.title}
                                        </p>
                                        <p className="text-xs text-zinc-500 flex items-center justify-end gap-1">
                                            <MapPin size={12} /> {r.theaterName}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 text-4xl text-zinc-100 dark:text-zinc-800 font-serif leading-none">“</span>
                                    <p className="text-zinc-700 dark:text-zinc-300 italic pl-4">
                                        {r.comment || "No written comment provided."}
                                    </p>
                                </div>
                                
                                {r.createdAt && (
                                    <p className="text-[10px] text-zinc-400 text-right pt-2 border-t border-zinc-50 dark:border-zinc-800">
                                        Posted on {new Date(r.createdAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component for clean Star Ratings
const StarRating = ({ rating }) => {
    return (
        <div className="flex gap-0.5">
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

export default OwnerReviews;