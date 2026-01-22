import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Film, Users, X, Info, LayoutGrid, ReceiptText, Loader2 } from "lucide-react";

export default function OwnerTodayBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null); // For Modal

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/api/owner/bookings/today", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => {
      setBookings(res.data.data);
      setLoading(false);
    });
  }, []);

  // Grouping Logic: Theatre -> Movie -> Bookings
  const grouped = bookings.reduce((acc, b) => {
    const theater = b.theaterDetails?.name || "General";
    const movie = b.showDetails?.movieName || "Unknown Movie";

    acc[theater] = acc[theater] || {};
    acc[theater][movie] = acc[theater][movie] || [];
    acc[theater][movie].push(b);
    return acc;
  }, {});

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Theatre Operations</h1>
            <p className="text-zinc-500 font-medium">Monitoring live bookings per venue</p>
          </div>
          <div className="bg-red-600/10 text-red-600 px-4 py-2 rounded-xl font-bold border border-red-600/20">
            {new Date().toDateString()}
          </div>
        </header>

        {Object.entries(grouped).map(([theaterName, movies]) => (
          <section key={theaterName} className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold uppercase">{theaterName}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(movies).map(([movieName, movieBookings]) => {
                const totalSeats = movieBookings.reduce((sum, b) => sum + b.seats.length, 0);
                const totalRev = movieBookings.reduce((sum, b) => sum + b.totalAmount, 0);

                return (
                  <div key={movieName} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-red-500 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                        <Film className="text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Show</span>
                    </div>

                    <h3 className="text-xl font-bold mb-1 truncate">{movieName}</h3>
                    <p className="text-sm text-zinc-500 mb-6">Today's Performance</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Seats Sold</p>
                        <p className="text-lg font-black">{totalSeats}</p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Revenue</p>
                        <p className="text-lg font-black text-red-600">₹{totalRev}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedShow({ theaterName, movieName, bookings: movieBookings })}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all"
                    >
                      <Users size={16} /> View Bookings
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setSelectedShow(null)}></div>
          
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <header className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{selectedShow.movieName}</h3>
                <p className="text-zinc-500 text-sm flex items-center gap-2">
                  <MapPin size={14} /> {selectedShow.theaterName} • Today's Guest List
                </p>
              </div>
              <button onClick={() => setSelectedShow(null)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition">
                <X size={24} />
              </button>
            </header>

            <div className="p-8 overflow-x-auto max-h-[60vh]">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                    <th className="pb-4 px-2">Customer Details</th>
                    <th className="pb-4">Booking ID</th>
                    <th className="pb-4">Show Time</th>
                    <th className="pb-4">Seats</th>
                    <th className="pb-4 text-right">Paid Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                  {selectedShow.bookings.map((b) => (
                    <tr key={b._id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="py-4 px-2">
                        <p className="font-bold">{b.user?.name}</p>
                        <p className="text-xs text-zinc-500">{b.user?.email}</p>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                          #{b._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium">{b.showDetails?.time}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {b.seats.map(s => (
                            <span key={s} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 text-[10px] font-bold rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <p className="font-black text-red-600">₹{b.totalAmount}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="p-6 bg-zinc-50 dark:bg-zinc-800/50 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-t border-zinc-100 dark:border-zinc-800">
              Total Managed Revenue: ₹{selectedShow.bookings.reduce((s, b) => s + b.totalAmount, 0)}
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}