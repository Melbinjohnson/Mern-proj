
import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, MapPin, Armchair, X, Plus } from "lucide-react";

const MyTheaters = () => {
    const [theaters, setTheaters] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchTheaters();
    }, []);

    const fetchTheaters = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/owner/theater", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTheaters(res.data);
        } catch (err) {
            console.error("Error fetching theaters", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this theater?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/owner/theater/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTheaters();
        } catch (err) {
            alert("Failed to delete theater");
        }
    };

    const getTotalSeats = (seatLayout) =>
        seatLayout.reduce((sum, row) => sum + Number(row.seatCount), 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-red-600">My Theaters</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your registered cinema locations and seating plans.</p>
                </header>

                {theaters.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                        <p className="text-zinc-500">No theaters added yet. Start by adding one from the dashboard.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {theaters.map((theater) => (
                            <div key={theater._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-5 space-y-4">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-600">
                                                <Armchair size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold dark:text-white">{theater.name}</h2>
                                                <p className="text-zinc-500 text-sm flex items-center gap-1">
                                                    <MapPin size={14} /> {theater.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => { setSelectedTheater(theater); setEditModalOpen(true); }}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-blue-500 transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(theater._id)}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-red-500 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Summary */}
                                    <div className="flex gap-4 py-2 border-y border-zinc-100 dark:border-zinc-800">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-zinc-400">Total Capacity</p>
                                            <p className="text-lg font-semibold dark:text-white">{getTotalSeats(theater.seatLayout)} Seats</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-zinc-400">Rows</p>
                                            <p className="text-lg font-semibold dark:text-white">{theater.seatLayout.length}</p>
                                        </div>
                                    </div>

                                    {/* Seat Layout Badges */}
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Seating Configuration</p>
                                        <div className="flex flex-wrap gap-2">
                                            {theater.seatLayout.map((row, idx) => (
                                                <div key={idx} className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md flex gap-3 text-sm">
                                                    <span className="font-bold text-red-500">Row {row.row}</span>
                                                    <span className="text-zinc-600 dark:text-zinc-300">{row.seatCount} seats</span>
                                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">₹{row.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {editModalOpen && selectedTheater && (
                <Modal title="Edit Theater" onClose={() => setEditModalOpen(false)}>
                    <EditTheaterForm 
                        theater={selectedTheater} 
                        token={token} 
                        onSuccess={() => { setEditModalOpen(false); fetchTheaters(); }} 
                    />
                </Modal>
            )}
        </div>
    );
};

const EditTheaterForm = ({ theater, token, onSuccess }) => {
    const [form, setForm] = useState({
        name: theater.name,
        location: theater.location,
        seatLayout: theater.seatLayout.map(row => ({
            row: row.row,
            seatCount: row.seatCount,
            price: row.price,
        })),
    });

    const inputClass = "w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-3 py-2 rounded-md focus:ring-2 ring-red-500 outline-none transition text-zinc-900 dark:text-white";

    const updateRow = (index, field, value) => {
        const updated = [...form.seatLayout];
        updated[index][field] = value;
        setForm({ ...form, seatLayout: updated });
    };

    const addRow = () => {
        setForm({ ...form, seatLayout: [...form.seatLayout, { row: "", seatCount: "", price: "" }] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/owner/theater/${theater._id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onSuccess();
        } catch (err) {
            alert("Error updating theater");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Basic Info</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Theater Name" required />
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="Location" required />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Seating Rows</label>
                    <button type="button" onClick={addRow} className="text-xs text-red-500 hover:text-red-400 font-bold flex items-center gap-1">
                        <Plus size={14} /> ADD ROW
                    </button>
                </div>
                
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {form.seatLayout.map((row, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input value={row.row} onChange={(e) => updateRow(idx, "row", e.target.value)} placeholder="Row" className={`${inputClass} text-sm`} required />
                            <input type="number" value={row.seatCount} onChange={(e) => updateRow(idx, "seatCount", e.target.value)} placeholder="Seats" className={`${inputClass} text-sm`} required />
                            <input type="number" value={row.price} onChange={(e) => updateRow(idx, "price", e.target.value)} placeholder="Price" className={`${inputClass} text-sm`} required />
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-red-500/20">
                Update Theater
            </button>
        </form>
    );
};

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition text-zinc-500"><X size={20} /></button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

export default MyTheaters;