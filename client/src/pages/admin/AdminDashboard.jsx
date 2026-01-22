import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Film, 
  ClipboardList, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  LayoutDashboard,
  ArrowRight
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white">Admin Central</h1>
              <p className="text-zinc-500 dark:text-zinc-400">Manage global platform data and security.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online
          </div>
        </header>

        {/* Quick Insights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsMini label="Total Revenue" value="₹12.4L" icon={<TrendingUp size={16}/>} />
            <StatsMini label="Platform Users" value="8.2K" icon={<Users size={16}/>} />
            <StatsMini label="Total Movies" value="450+" icon={<Film size={16}/>} />
            <StatsMini label="Avg. Rating" value="4.8/5" icon={<Star size={16}/>} />
        </div>

        {/* Management Grid */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">System Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminCard 
              title="All Bookings" 
              desc="Monitor platform-wide ticket sales" 
              icon={<ClipboardList className="text-blue-500" />} 
              onClick={() => navigate("/admin/bookings")} 
            />
            <AdminCard 
              title="Theater Owners" 
              desc="Approve and manage partners" 
              icon={<Users className="text-orange-500" />} 
              onClick={() => navigate("/admin/owners")} 
            />
            <AdminCard 
              title="Movie Database" 
              desc="Manage global movie listings" 
              icon={<Film className="text-red-500" />} 
              onClick={() => navigate("/admin/movies")} 
            />
            <AdminCard 
              title="Platform Reviews" 
              desc="Moderate user feedback" 
              icon={<Star className="text-yellow-500" />} 
              onClick={() => navigate("/admin/reviews")} 
            />
          </div>
        </section>

        {/* Advanced Tools Placeholder */}
        <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-4 items-center">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                    <LayoutDashboard className="text-zinc-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg dark:text-white">Platform Analytics</h3>
                    <p className="text-zinc-500 text-sm">Download detailed CSV reports for tax and auditing purposes.</p>
                </div>
            </div>
            <button className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 transition">
                Generate Reports
            </button>
        </div>
      </div>
    </div>
  );
};

const StatsMini = ({ label, value, icon }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold dark:text-white mt-0.5">{value}</p>
        </div>
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400">
            {icon}
        </div>
    </div>
);

const AdminCard = ({ title, desc, icon, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-red-500/5 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={20} className="text-red-500" />
    </div>
    
    <div className="mb-6 p-3 w-fit rounded-2xl bg-zinc-50 dark:bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    
    <h2 className="text-xl font-bold dark:text-white mb-2">{title}</h2>
    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{desc}</p>
    
    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-red-600 dark:text-red-500 tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity">
        Open Module
    </div>
  </div>
);

export default AdminDashboard;