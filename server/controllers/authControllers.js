import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // allow only valid roles
    const userRole =
      role && ["user", "admin", "owner"].includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        name: user.name,      // ✅ ADD THIS
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    

    // ✅ THIS IS THE IMPORTANT PART
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
      },
    });
    
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

/* ================= PROFILE ================= */
// GET /api/auth/profile
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email"); //

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email required" });
    }

    // Prevent email collision
    const existing = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("name email");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

/* ================= CHECK USER ================= */
export const checkUser = async (req, res) => {
  res.status(200).json({ message: "User authenticated", user: req.user });
};

/* ================= CHECK ADMIN ================= */
export const checkAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access denied" });
  }
  res.status(200).json({ message: "Admin access granted" });
};
