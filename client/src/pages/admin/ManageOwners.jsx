import { useEffect, useState } from "react";
import axios from "axios";
import { UserX, Search, Mail, Shield, Loader2, Trash2, UserCheck } from "lucide-react";

const ManageOwners = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/admin/owners", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setOwners(res.data);
        } catch (err) {
            console.error("Failed to fetch owners", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this owner? All associated theaters may be affected.")) return;

        try {
            await axios.delete(`http://localhost:3000/api/admin/owner/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setOwners(owners.filter(o => o._id !== id));
        } catch (err) {
            alert("Failed to delete owner");
        }
    };

    const filteredOwners = owners.filter(o => 
        o.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-red-600" size={40} />
                    <p className="text-zinc-500 font-medium animate-pulse">Fetching owners...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
                            <Shield className="text-red-600" size={28} />
                            Theater Owners
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Manage and oversee all registered theater partners.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 ring-red-500/20 transition-all dark:text-white"
                        />
                    </div>
                </header>

                {filteredOwners.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <UserX className="mx-auto mb-4 text-zinc-300" size={50} />
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">No owners found</p>
                        <p className="text-zinc-400 text-sm">Try adjusting your search or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOwners.map(owner => (
                            <div
                                key={owner._id}
                                className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-red-500/50 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 flex items-center justify-center font-bold text-xl">
                                            {owner.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg dark:text-white group-hover:text-red-600 transition-colors">
                                                {owner.name}
                                            </h2>
                                            <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center gap-1.5">
                                                <Mail size={14} /> {owner.email}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleDelete(owner._id)}
                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        title="Delete Owner"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                        <UserCheck size={12} className="text-green-500" />
                                        Verified Partner
                                    </div>
                                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500 dark:text-zinc-400 font-mono">
                                        ID: {owner._id.slice(-6)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <footer className="text-center text-zinc-400 text-xs">
                    Showing {filteredOwners.length} registered theater owners
                </footer>
            </div>
        </div>
    );
};

export default ManageOwners;