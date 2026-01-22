import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Armchair, Loader2, CreditCard } from "lucide-react";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [seatMap, setSeatMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/shows/${showId}/seats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const grouped = {};
        res.data.forEach((seat) => {
          const row = seat.seatNumber[0];
          if (!grouped[row]) grouped[row] = [];
          grouped[row].push(seat);
        });
        setSeatMap(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [showId, token]);

  const toggleSeat = (seat) => {
    if (seat.isBooked || seat.isLocked) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.seatNumber)
        ? prev.filter((s) => s !== seat.seatNumber)
        : [...prev, seat.seatNumber]
    );
  };

  const totalPrice = Object.values(seatMap)
    .flat()
    .filter((seat) => selectedSeats.includes(seat.seatNumber))
    .reduce((sum, seat) => sum + seat.price, 0);

  /* ================= RAZORPAY DUMMY IMPLEMENTATION ================= */
  const handlePayment = async () => {
    if (selectedSeats.length === 0) return;

    const options = {
      key: "rzp_test_UZxFx9Yabljqin", // Replace with your test key from Razorpay Dashboard
      amount: totalPrice * 100, // Amount in paisa
      currency: "INR",
      name: "MovieBook",
      description: "Movie Ticket Booking",
      handler: async function (response) {
        // This callback runs only on successful dummy payment
        setIsProcessing(true);
        await handleFinalBooking(response.razorpay_payment_id);
      },
      prefill: {
        name: localStorage.getItem("userName") || "Guest User",
        email: "test@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "movie Booking Office",
      },
      theme: {
        color: "#DC2626", // Matches your Red-600 theme
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert("Payment Failed: " + response.error.description);
    });
    rzp1.open();
  };

  const handleFinalBooking = async (paymentId) => {
    try {
      // 1. Lock seats
      await axios.post(
        "http://localhost:3000/api/seats/lock",
        { showId, seats: selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Create booking with Payment ID
      await axios.post(
        "http://localhost:3000/api/bookings",
        { 
          showId, 
          seats: selectedSeats, 
          totalAmount: totalPrice,
          paymentId: paymentId // Sending the dummy payment ID to backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/booking-success");
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || isProcessing) return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950">
      <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
      {isProcessing && <p className="text-zinc-400 animate-pulse">Confirming Payment...</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32 transition-colors duration-200">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-none">Choose Your Seats</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">₹{totalPrice > 0 ? totalPrice : '--'} Payable</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* SCREEN VISUAL */}
        <div className="relative flex flex-col items-center mb-20">
          <div className="w-full max-w-[600px] h-[4px] bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-full"></div>
          <p className="text-[10px] mt-4 tracking-[0.5em] font-black uppercase text-zinc-400">Screen This Way</p>
        </div>

        {/* SEATING MAP (Simplified for brevity, use your previous JSX here) */}
        <div className="flex flex-col gap-10 items-center overflow-x-auto py-4">
          {Object.entries(seatMap).map(([row, seats]) => (
            <div key={row} className="flex items-center gap-6 min-w-max">
              <span className="text-xs font-black text-zinc-400 w-4">{row}</span>
              <div className="flex gap-3">
                {seats.map((seat) => (
                  <button
                    key={seat.seatNumber}
                    disabled={seat.isBooked || seat.isLocked}
                    onClick={() => toggleSeat(seat)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        selectedSeats.includes(seat.seatNumber) ? "bg-red-600 border-red-600 text-white" : "border-zinc-300 dark:border-zinc-700"
                    } ${seat.isBooked ? "bg-zinc-800 opacity-20" : ""}`}
                  >
                    <Armchair size={14} className="mx-auto" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 p-6 z-50">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <p className="text-2xl font-black">₹{totalPrice}</p>
                <p className="text-xs text-zinc-400">{selectedSeats.length} Seats Selected</p>
            </div>

            <button
              onClick={handlePayment}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
            >
              <CreditCard size={20} />
              Pay & Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;