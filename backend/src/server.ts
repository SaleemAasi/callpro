import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional, helps with form-data

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("CallMyChild Backend Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
