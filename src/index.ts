import { errorHandler } from "./middlewares";
import cookieParser from "cookie-parser";
import { PORT } from "./config";
import express from "express";
import routes from "./routes"; // Import routes and apply them to the app
import morgan from "morgan";
import cors from "cors";
import path from "path";
import DB from "./db";

// Create an Express app instance and configure it to use middleware for parsing JSON request bodies
const app = express();

app.use(cookieParser());

// Enable CORS for all routes in the application
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://192.168.1.3:3000",
        "https://pn-web.netlify.app/",
      ];

      if (origin && allowedOrigins.includes(origin))
        return callback(null, true);
    },
    // origin: "http://localhost:3000",
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

app.use(errorHandler);

// Connect to the database before starting the server
DB.connect();

// Start the server and log a message to the console when it's listening
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
