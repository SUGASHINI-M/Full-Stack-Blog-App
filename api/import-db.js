import "dotenv/config";
import { connectDB } from "./db.js";

connectDB()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });
