import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Loader2 } from "lucide-react";
// 1. Import toast and Toaster
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user"); 

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
      
      // 2. Add Success Toast
      toast.success(`Welcome back, ${res.data.user.name}!`, {
        style: {
          borderRadius: '12px',
          background: '#27272a',
          color: '#fff',
        },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("role", res.data.user.role);

      window.dispatchEvent(new Event("storage"));

      // Small delay so they see the success message
      setTimeout(() => {
        if (res.data.user.role === "owner") {
          navigate("/owner/dashboard", { replace: true });
        } else if (res.data.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 1000);

    } catch (err) {
      // 3. Add Error Toast
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMsg, {
        style: {
          borderRadius: '12px',
          background: '#27272a',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-10 py-3 text-zinc-900 dark:text-white focus:ring-2 ring-yellow-400 outline-none transition-all placeholder:text-zinc-400";

  return (
    <AuthLayout title="Welcome Back">
      {/* 4. Add Toaster component */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <form className="space-y-6 mt-4" onSubmit={handleLogin}>
        
        {/* Email Field */}
        <div className="relative">
          <label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1 mb-2 block">
            Email Address
          </label>
          <Mail className="absolute left-3 top-[38px] text-zinc-400" size={18} />
          <input
            type="email"
            required
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1 mb-2 block">
            Password
          </label>
          <Lock className="absolute left-3 top-[38px] text-zinc-400" size={18} />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1 block">
            I am a...
          </label>
          <div className="flex p-1 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
            {["user", "owner", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  role === r 
                  ? "bg-yellow-400 text-zinc-900 shadow-sm" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-70 text-zinc-900 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Sign In"
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          New to the platform?{" "}
          <Link to="/register" className="text-yellow-500 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;