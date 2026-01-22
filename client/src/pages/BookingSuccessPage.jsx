import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Ticket, CreditCard, Armchair } from "lucide-react";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/bookings");
    }, 3000);

    return () => {
      clearTimeout(redirect);
      clearInterval(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4 transition-colors duration-200">
      <div className="bg-white dark:bg-zinc-900 max-w-md w-full rounded-[2.5rem] shadow-2xl dark:shadow-none border border-zinc-100 dark:border-zinc-800 p-10 text-center animate-in fade-in zoom-in duration-500">
        
        {/* Animated Success Icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-green-500/20 dark:bg-green-500/10 rounded-full animate-ping"></div>
          <div className="relative w-full h-full flex items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/40">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            Order Confirmed!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Your cinematic experience is ready.
          </p>
        </div>

        {/* Mini Receipt Card */}
        <div className="mt-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 text-left space-y-4 border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 text-sm font-bold dark:text-zinc-200">
            <Armchair size={18} className="text-red-500" />
            <span>Seats Reserved Successfully</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold dark:text-zinc-200">
            <CreditCard size={18} className="text-red-500" />
            <span>Payment Status: <span className="text-green-500 uppercase">Paid</span></span>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold dark:text-zinc-200">
            <Ticket size={18} className="text-red-500" />
            <span>Confirmation: Sent to Email</span>
          </div>
        </div>

        {/* Manual action & Timer */}
        <div className="mt-10 space-y-4">
          <button
            onClick={() => navigate("/bookings")}
            className="w-full bg-zinc-900 dark:bg-red-600 hover:bg-zinc-800 dark:hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 group active:scale-95"
          >
            Go to My Bookings
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em]">
            Redirecting in {timeLeft} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;