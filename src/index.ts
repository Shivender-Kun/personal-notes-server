import { ALLOWED_ORIGINS } from "./constants";
import { errorHandler } from "./middlewares";
import cookieParser from "cookie-parser";
import { PORT } from "./config";
import express from "express";
import routes from "./routes";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import DB from "./db";

// Create an instance of the Express application
const app = express();

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Enable CORS for all routes in the application
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        // Allow requests with no origin (like server-to-server or health checks)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Set up middleware for logging requests
app.use(morgan("dev"));

// Set up middleware for parsing JSON request bodies
app.use(express.json());

// Render HTML on the root path of the application
app.use(express.static(path.join(__dirname, "../public")));

// Apply the routes to the app
app.use("/api/admin", routes.Admin);
app.use("/api/notes", routes.Note);
app.use("/api/labels", routes.Label);
app.use("/api/users", routes.User);

// Handle errors
app.use(errorHandler);

DB.connect();

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
