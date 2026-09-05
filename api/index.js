import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import { connectDB } from "./db.js";

const app = express();

// Allow frontend (dev server) to send credentials (cookies)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  if (!file) return res.status(400).json("Only image files are allowed.");
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

connectDB()
  .then(() => {
    app.listen(8800, () => {
      console.log("API listening on http://localhost:8800");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
