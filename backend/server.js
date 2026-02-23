import express from "express";
import cors from "cors";
import morgan from 'morgan';
import automatonRoutes from "./routes/automatonRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Use routes
app.use("/api", automatonRoutes);

// Start server (no database needed - using client-side storage)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Using client-side storage (localStorage)");
});
