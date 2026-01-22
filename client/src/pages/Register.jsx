import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';


const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const res = await axios.post("http://localhost:3000/api/auth/signup", payload);

      // If we reach here, it's a 201 Success
      toast.success('Registration Successful!', {
        style: { borderRadius: '12px', background: '#27272a', color: '#fff' },
      });

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      // Check if the server sent a specific error message
      const errorMessage = err.response?.data?.message || "Something went wrong";

      // This will now show "User already exists" if that's what the backend sent
      toast.error(errorMessage, {
        style: { borderRadius: '12px', background: '#27272a', color: '#fff' },
      });

    } finally {
      setLoading(false);
    }
  };


  const inputContainerClass = "relative mt-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400";
  const inputClass = "w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-10 py-3 text-zinc-900 dark:text-white focus:ring-2 ring-yellow-400 outline-none transition-all placeholder:text-zinc-400";
  const labelClass = "text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1";

  return (
    <AuthLayout title="Create Account">
      <Toaster position="top-center" reverseOrder={false} />
      <form className="space-y-5 mt-4" onSubmit={handleSubmit}>

        {/* Full Name Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>First Name</label>
            <div className={inputContainerClass}>
              <User className={iconClass} size={18} />
              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Last Name</label>
            <div className={inputContainerClass}>
              <User className={iconClass} size={18} />
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className={labelClass}>Email Address</label>
          <div className={inputContainerClass}>
            <Mail className={iconClass} size={18} />
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className={labelClass}>Password</label>
          <div className={inputContainerClass}>
            <Lock className={iconClass} size={18} />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className={labelClass}>Join as a...</label>
          <div className="flex p-1 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
            {["user", "owner"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${form.role === r
                    ? "bg-yellow-400 text-zinc-900 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}
              >
                {r === "user" ? "user" : "owner"}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-70 text-zinc-900 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 font-bold hover:underline ml-1">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;