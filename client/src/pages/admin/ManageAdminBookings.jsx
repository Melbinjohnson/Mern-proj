import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Film, User, CreditCard, Clock, Loader2 } from "lucide-react";

const ManageAdminBookings = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/bookings-info", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      groupBookings(res.data.data);
      setLoading(false);
    });
  }, []);

  const groupBookings = (bookings) => {
    const result = {};
    bookings.forEach(b => {
      const date = b.show?.date ? new Date(b.show.date).toLocaleDateString() : "Unknown Date";
      const theater = b.theater?.name || "Unknown Theater";
      const showKey = `${b.show?.movieId?.title} | ${b.show?.time}`;

      if (!result[date]) result[date] = {};
      if (!result[date][theater]) result[date][theater] = {};
      if (!result[date][theater][showKey]) result[date][theater][showKey] = [];

      result[date][theater][showKey].push(b);
    });
    setGrouped(result);
  };

  const getBookedSeats = (theaterData) => {
    let booked = 0;
    Object.keys(theaterData).forEach(show => {
      theaterData[show].forEach(b => { booked += b.seats.length; });
    });
    return booked;
  };

  const getTotalSeatsFromLayout = (theaterData) => {
    const sampleBooking = theaterData[Object.keys(theaterData)[0]]?.[0];
    if (!sampleBooking?.theater?.seatLayout) return 0;
    return sampleBooking.theater.seatLayout.reduce((sum, row) => sum + row.seatCount, 0);
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-bold dark:text-white">Booking Intelligence</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Detailed breakdown of shows, theater occupancy, and revenue.</p>
        </header>

        {Object.keys(grouped).map(date => (
          <div key={date} className="space-y-6">
            {/* Date Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-red-600 text-white rounded-full text-sm font-bold shadow-md">
              <Calendar size={16} />
              {date}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {Object.keys(grouped[date]).map(theater => {
                const booked = getBookedSeats(grouped[date][theater]);
                const total = getTotalSeatsFromLayout(grouped[date][theater]);
                const percent = Math.round((booked / total) * 100);

                return (
                  <div key={theater} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm overflow-hidden">
                    {/* Theater Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-50 dark:border-zinc-800 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
                          <MapPin size={24} />
                        </div>
                        <h3 className="text-2xl font-bold dark:text-white">{theater}</h3>
                      </div>
                      
                      <div className="w-full md:w-64 space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                          <span>Occupancy</span>
                          <span>{booked} / {total} Seats</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${percent > 80 ? 'bg-green-500' : 'bg-red-500'}`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shows for this theater */}
                    <div className="space-y-10">
                      {Object.keys(grouped[date][theater]).map(show => (
                        <div key={show} className="space-y-4">
                          <h4 className="flex items-center gap-2 font-bold text-lg dark:text-zinc-200">
                            <Film className="text-red-500" size={18} />
                            {show}
                          </h4>

                          <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold">
                                <tr>
                                  <th className="px-4 py-3">Customer</th>
                                  <th className="px-4 py-3">Seats</th>
                                  <th className="px-4 py-3">Amount</th>
                                  <th className="px-4 py-3">Status</th>
                                  <th className="px-4 py-3 text-right">Time</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                                {grouped[date][theater][show].map(b => (
                                  <tr key={b._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2 font-medium dark:text-white">
                                        <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px]">
                                          <User size={12} />
                                        </div>
                                        {b.user?.name}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                        {b.seats.join(", ")}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-red-600 dark:text-red-500">
                                      ₹{b.totalAmount}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        b.paymentStatus === 'paid' 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-500' 
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-500'
                                      }`}>
                                        {b.paymentStatus}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-zinc-400 text-xs">
                                      {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAdminBookings;