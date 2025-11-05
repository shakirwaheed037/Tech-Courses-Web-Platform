const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// Routes of the project 
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// MongoDB connection ( mongoDB WITH ATLAS)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
