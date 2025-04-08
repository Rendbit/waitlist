import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from './routes/user';

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Log HTTP requests (in 'dev' format: method + status + response time)
app.use(morgan("dev"));

// Parse incoming JSON requests
app.use(bodyParser.json());

// Optionally parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/user", userRoutes);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Rendbit Waitlist API");
});

// Handle 404 (Not Found)
app.use((req: Request, res: Response) => {
  res.status(404).sendFile(path.join(__dirname, "public", "error", "404.html"));
});

// Server listen port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
