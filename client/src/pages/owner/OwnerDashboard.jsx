import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Film, Star, TrendingUp, Calendar, MapPin, X } from "lucide-react";

const OwnerDashboard = () => {
    const [showTheaterModal, setShowTheaterModal] = useState(false);
    const [showShowModal, setShowShowModal] = useState(false);
    const [theaters, setTheaters] = useState([]);
    const [movies, setMovies] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalTheaters: 0,
        showsToday: 0,
        todaysStats: { bookings: 0, seatsBooked: 0, revenue: 0 },
        allTimeStats: { bookings: 0, seatsBooked: 0, revenue: 0 },
    });

    const [theaterForm, setTheaterForm] = useState({
        name: "",
        location: "",
        seatLayout: [{ row: "A", seatCount: "", price: "" }],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moviesRes, theatersRes, statsRes] = await Promise.all([
                    axios.get("http://localhost:3000/api/movies"),
                    axios.get("http://localhost:3000/api/owner/theater", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("http://localhost:3000/api/owner/dashboard-stats", { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setMovies(moviesRes.data.data);
                setTheaters(theatersRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error("Fetch error", err);
            }
        };
        fetchData();
    }, [token]);

    const addRow = () => {
        setTheaterForm({
            ...theaterForm,
            seatLayout: [...theaterForm.seatLayout, { row: "", seatCount: "", price: "" }],
        });
    };

    const updateRow = (index, field, value) => {
        const updatedRows = [...theaterForm.seatLayout];
        updatedRows[index][field] = value;
        setTheaterForm({ ...theaterForm, seatLayout: updatedRows });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header */}
                <header>
                    <h1 className="text-3xl font-bold text-red-600">Owner Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Monitor your theaters and real-time performance.</p>
                </header>

                {/* QUICK ACTIONS */}
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-red-800 dark:text-red-500 mb-4">Quick Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ActionCard 
                            title="Create Shows" 
                            desc="Schedule movies and timings" 
                            icon={<Film className="text-red-500" />} 
                            onClick={() => setShowShowModal(true)} 
                        />
                        <ActionCard 
                            title="View Reviews" 
                            desc="Check customer feedback" 
                            icon={<Star className="text-yellow-500" />} 
                            onClick={() => navigate("/owner/reviews")} 
                        />
                        <ActionCard 
                            title="Add Theatre" 
                            desc="Register a new location" 
                            icon={<Plus className="text-blue-500" />} 
                            onClick={() => setShowTheaterModal(true)}                        
                        />
                    </div>
                </section>

                {/* OVERVIEW STATS */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Theaters" value={stats.totalTheaters} />
                    <StatCard label="Active Shows" value={stats.showsToday} />
                    <StatCard label="Today's Revenue" value={`₹${stats.todaysStats.revenue}`} highlight />
                    <StatCard label="Total Revenue" value={`₹${stats.allTimeStats.revenue}`} highlight />
                </section>

                {/* DETAILED STATS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <StatsSection 
                        title="Daily Performance" 
                        stats={[
                            { label: "Bookings Today", value: stats.todaysStats.bookings, action: () => navigate("/owner/today-bookings") },
                            { label: "Seats Filled", value: stats.todaysStats.seatsBooked }
                        ]}
                    />
                    <StatsSection 
                        title="Lifetime Performance" 
                        stats={[
                            { label: "Total Bookings", value: stats.allTimeStats.bookings, action: () => navigate("/owner/all-bookings") },
                        ]}
                    />
                </div>
            </div>

            {/* THEATER MODAL */}
            {showTheaterModal && (
                <Modal title="Add Theater" onClose={() => setShowTheaterModal(false)}>
                    <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        await axios.post("http://localhost:3000/api/owner/theater", theaterForm, { headers: { Authorization: `Bearer ${token}` } });
                        setShowTheaterModal(false);
                    }}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Theater Details</label>
                            <input
                                type="text" placeholder="Theater Name"
                                value={theaterForm.name}
                                onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
                                className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 px-3 py-2 rounded-md focus:ring-2 ring-red-500 outline-none transition"
                                required
                            />
                            <input
                                type="text" placeholder="Location"
                                value={theaterForm.location}
                                onChange={(e) => setTheaterForm({ ...theaterForm, location: e.target.value })}
                                className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 px-3 py-2 rounded-md focus:ring-2 ring-red-500 outline-none transition"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-3">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Seat Configuration</label>
                                <button type="button" onClick={addRow} className="text-xs text-red-500 font-bold hover:underline">+ ADD ROW</button>
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                                {theaterForm.seatLayout.map((row, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input placeholder="Row" value={row.row} onChange={(e) => updateRow(index, "row", e.target.value)} className="w-1/4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-none px-2 py-1.5 rounded text-sm" required />
                                        <input type="number" placeholder="Seats" value={row.seatCount} onChange={(e) => updateRow(index, "seatCount", e.target.value)} className="w-1/3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-none px-2 py-1.5 rounded text-sm" required />
                                        <input type="number" placeholder="Price" value={row.price} onChange={(e) => updateRow(index, "price", e.target.value)} className="w-1/3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-none px-2 py-1.5 rounded text-sm" required />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-red-500/20">
                            Register Theater
                        </button>
                    </form>
                </Modal>
            )}

            {/* SHOW MODAL */}
            {showShowModal && (
                <Modal title="Create New Show" onClose={() => setShowShowModal(false)}>
                    <CreateShowForm theaters={theaters} token={token} movies={movies} onSuccess={() => setShowShowModal(false)} />
                </Modal>
            )}
        </div>
    );
};

const ActionCard = ({ title, desc, icon, onClick }) => (
    <div onClick={onClick} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl cursor-pointer hover:border-red-500 transition-all shadow-sm">
        <div className="mb-4 p-3 w-fit rounded-xl bg-zinc-50 dark:bg-zinc-800 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="font-bold text-lg dark:text-white">{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{desc}</p>
    </div>
);

const StatCard = ({ label, value, highlight }) => (
    <div className="p-6 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">{label}</p>
        <h2 className={`text-3xl font-bold dark:text-white ${highlight ? 'text-red-600 dark:text-red-500' : ''}`}>{value}</h2>
    </div>
);

const StatsSection = ({ title, stats }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
            <TrendingUp size={20} className="text-red-600" /> {title}
        </h2>
        <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
                <div key={i} onClick={s.action} className={`p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${s.action ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition' : ''}`}>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-tight">{s.label}</p>
                    <p className="text-2xl font-bold mt-1 dark:text-white">{s.value}</p>
                </div>
            ))}
        </div>
    </div>
);

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition text-zinc-500"><X size={20} /></button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

const CreateShowForm = ({ theaters, movies, token, onSuccess }) => {
    const [form, setForm] = useState({ theaterId: "", movieId: "", date: "", time: "", basePrice: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:3000/api/owner/show", { ...form, basePrice: Number(form.basePrice) }, { headers: { Authorization: `Bearer ${token}` } });
        onSuccess();
    };

    const inputClass = "w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 px-3 py-2 rounded-md focus:ring-2 ring-red-500 outline-none transition";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <select required value={form.theaterId} onChange={(e) => setForm({ ...form, theaterId: e.target.value })} className={inputClass}>
                <option value="" className="text-zinc-500">Select Theater</option>
                {theaters.map((t) => <option key={t._id} value={t._id} className="dark:bg-zinc-900 text-zinc-900 dark:text-white">{t.name} – {t.location}</option>)}
            </select>
            <select required value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })} className={inputClass}>
                <option value="" className="text-zinc-500">Select Movie</option>
                {movies.map((m) => <option key={m._id} value={m._id} className="dark:bg-zinc-900 text-zinc-900 dark:text-white">{m.title}</option>)}
            </select>
            <div className="flex gap-2">
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
                <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputClass} />
            </div>
            <input type="number" required placeholder="Base Ticket Price" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className={inputClass} />
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/20">Create Show</button>
        </form>
    );
};

export default OwnerDashboard;