import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiCheck, FiUser, FiMail, FiShield } from "react-icons/fi";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      setTimeout(() => {
        setIsUpdating(false);
        setEdit(false);
      }, 800);
    } catch (err) {
      console.error("Update failed", err);
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-zinc-500 animate-pulse font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors duration-200">
      <div className="max-w-xl mx-auto py-10">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 transition-all">
          
          <header className="mb-10 text-center">
            <h1 className="text-2xl font-bold dark:text-white">Account Settings</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage your public profile and email</p>
          </header>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-red-50 dark:bg-red-900/20 border-4 border-white dark:border-zinc-800 flex items-center justify-center text-4xl font-bold text-red-600 dark:text-red-500 shadow-inner">
                {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
            </div>
            <h3 className="mt-4 text-xl font-bold dark:text-white">{user.name || "User"}</h3>
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-2">
              Cinema Owner
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            <div className="relative">
              <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 ml-1">Full Name</label>
              <div className={`mt-2 flex items-center transition-all duration-300 border-b-2 ${edit ? 'border-red-600 py-2' : 'border-zinc-100 dark:border-zinc-800 py-3'}`}>
                <FiUser className={`${edit ? 'text-red-600' : 'text-zinc-300 dark:text-zinc-600'} mr-4 transition-colors`} size={20} />
                {!edit ? (
                  <p className="text-zinc-700 dark:text-zinc-200 font-semibold text-lg">{user.name}</p>
                ) : (
                  <input
                    value={user.name}
                    autoFocus
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full bg-transparent outline-none text-zinc-800 dark:text-white text-lg font-medium placeholder-zinc-300 dark:placeholder-zinc-600"
                    placeholder="Enter your name"
                  />
                )}
              </div>
            </div>

            <div className="relative">
              <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 ml-1">Email Address</label>
              <div className={`mt-2 flex items-center transition-all duration-300 border-b-2 ${edit ? 'border-red-600 py-2' : 'border-zinc-100 dark:border-zinc-800 py-3'}`}>
                <FiMail className={`${edit ? 'text-red-600' : 'text-zinc-300 dark:text-zinc-600'} mr-4 transition-colors`} size={20} />
                {!edit ? (
                  <p className="text-zinc-700 dark:text-zinc-200 font-semibold text-lg">{user.email}</p>
                ) : (
                  <input
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full bg-transparent outline-none text-zinc-800 dark:text-white text-lg font-medium placeholder-zinc-300 dark:placeholder-zinc-600"
                    placeholder="Enter your email"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-12">
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-lg shadow-zinc-900/10 dark:shadow-none"
              >
                <FiEdit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-red-600/20"
                >
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="w-full py-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-zinc-400 dark:text-zinc-600">
          <FiShield size={14} />
          <p className="text-xs">
            Your personal information is secured with 256-bit encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;