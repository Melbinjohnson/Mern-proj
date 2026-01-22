import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, Banknote, Users, Edit, Trash2, X, Ticket } from "lucide-react";
import toast from "react-hot-toast";

const MyShows = () => {
    const [shows, setShows] = useState([]);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [bookings, setBookings] = useState([]);
    const token = localStorage.getItem("token");
    const [editShow, setEditShow] = useState(null);

    useEffect(() => {
        fetchShows();
    }, []);

    const fetchShows = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/owner/shows", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShows(res.data);
        } catch (err) {
            console.error("Error fetching shows", err);
        }
    };

    const openBookings = async (showId) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/owner/shows/${showId}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
            setShowBookingsModal(true);
        } catch (err) {
            console.error("Error fetching bookings", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this show?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/owner/show/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchShows();
        } catch (err) {
            alert("Failed to delete show");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-red-600">My Shows</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage scheduled movies and view booking performance.</p>
                </header>

                {shows.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                        <Ticket className="mx-auto mb-4 text-zinc-400" size={48} />
                        <p className="text-zinc-500">No shows scheduled yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {shows.map((show) => (
                            <div key={show._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold dark:text-white">{show.movieId?.title}</h2>
                                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                                            🎭 {show.theaterId?.name} – {show.theaterId?.location}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setEditShow(show)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-blue-500 transition"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(show._id)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-red-500 transition"><Trash2 size={18} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <InfoBadge icon={<Calendar size={14}/>} label="Date" value={new Date(show.date).toLocaleDateString()} />
                                    <InfoBadge icon={<Clock size={14}/>} label="Time" value={show.time} />
                                    <InfoBadge icon={<Banknote size={14}/>} label="Price" value={`₹${show.basePrice}`} />
                                </div>

                                <button 
                                    onClick={() => openBookings(show._id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium transition"
                                >
                                    <Users size={16} /> View Bookings
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* BOOKINGS MODAL */}
            {showBookingsModal && (
                <Modal title="Show Bookings" onClose={() => setShowBookingsModal(false)} maxWidth="max-w-4xl">
                    {bookings.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500">No bookings yet for this show.</div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Seats</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {bookings.map((b) => (
                                        <tr key={b._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                                            <td className="p-4">
                                                <div className="font-medium dark:text-white">{b.user?.name}</div>
                                                <div className="text-[11px] text-zinc-500">{b.user?.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded text-xs font-bold">
                                                    {b.seats.join(", ")}
                                                </span>
                                            </td>
                                            <td className="p-4 font-semibold dark:text-zinc-200">₹{b.totalAmount}</td>
                                            <td className="p-4 text-zinc-500 text-xs">
                                                {new Date(b.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal>
            )}

            {/* EDIT MODAL */}
            {editShow && (
                <Modal title="Edit Show Details" onClose={() => setEditShow(null)}>
                    <EditShowForm show={editShow} token={token} onSuccess={() => { setEditShow(null); fetchShows(); }} />
                </Modal>
            )}
        </div>
    );
};

const InfoBadge = ({ icon, label, value }) => (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">{icon} {label}</p>
        <p className="text-sm font-semibold mt-1 dark:text-zinc-200">{value}</p>
    </div>
);

const Modal = ({ title, children, onClose, maxWidth = "max-w-md" }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full ${maxWidth} shadow-2xl animate-in fade-in zoom-in duration-200`}>
            <div className="flex justify-between items-center p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 transition"><X size={20} /></button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);
// ... (MyShows component logic remains same)
const EditShowForm = ({ show, token, onSuccess }) => {
   // 1. STATE DEFINITIONS
   const [form, setForm] = useState({
    date: "",
    time: "",
    basePrice: "",
});

// 2. CSS CLASS DEFINITIONS (The missing part)
const inputClass = "w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 px-3 py-2 rounded-lg focus:ring-2 ring-red-500 outline-none transition";

useEffect(() => {
    if (show) {
        setForm({
            date: show.date ? show.date.split("T")[0] : "",
            time: show.time || "",
            basePrice: show.basePrice || "",
        });
    }
}, [show]);
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const payload = {
              date: form.date,
              time: form.time,
              basePrice: Number(form.basePrice),
          };

          await axios.put(
              `http://localhost:3000/api/owner/show/${show._id}`, 
              payload, 
              { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success("Show updated successfully!");
          onSuccess();
      } catch (err) {
          // Trigger the specific alert you requested
          toast.error("Update failed. Check if seats are already booked.", {
              duration: 4000,
              style: {
                  borderRadius: '12px',
                  background: '#27272a',
                  color: '#fff',
                  border: '1px solid #3f3f46'
              },
          });
          console.error("Update Error:", err);
      }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase">Current Movie</label>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm font-medium border border-zinc-100 dark:border-zinc-800">
                    <p className="dark:text-white">{show.movieId?.title}</p>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider">{show.theaterId?.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Date</label>
                    <input 
                        type="date" 
                        required 
                        value={form.date} 
                        onChange={(e) => setForm({ ...form, date: e.target.value })} 
                        className={inputClass} 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Time</label>
                    <input 
                        type="time" 
                        required 
                        value={form.time} 
                        onChange={(e) => setForm({ ...form, time: e.target.value })} 
                        className={inputClass} 
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Base Price (₹)</label>
                <input 
                    type="number" 
                    required 
                    value={form.basePrice} 
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })} 
                    className={inputClass} 
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button 
                    type="submit" 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-red-500/20 active:scale-95"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default MyShows;