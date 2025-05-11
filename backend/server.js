import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import pitchRoutes from "./routes/pitchRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow any URL to access the API
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/pitches", pitchRoutes);

// Base route
app.get("/", (_, res) => {
  // Replaced 'req' with '_' to indicate it's unused
  res.send("API is running...");
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
