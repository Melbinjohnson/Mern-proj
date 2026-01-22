import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

/* ===== ENV ===== */
dotenv.config();

const app = express();

/* ===== CORS ===== */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== ROUTES ===== */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is live 🚀" });
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/owner", ownerRouter);
app.use("/api", userRouter);

/* ===== STATIC FILES ===== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== DATABASE ===== */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // crash on DB failure (Railway restarts)
  });

/* ===== SERVER ===== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
