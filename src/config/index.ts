import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Access environment variables
export const {
  DB_USERNAME = "",
  DB_PASSWORD = "",
  DB_CLUSTER = "",
  DB_DATABASE = "",
  DEBUG_MODE = true,
  JWT_SECRET = "my-diary-secret",
  NODE_ENV = "development",
  ADMIN_SECRET_KEY,
  PORT = 3001,
} = process.env;

// Export the MongoDB connection URL
export const db_url = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.${DB_DATABASE}/${NODE_ENV}?retryWrites=true&w=majority&appName=Cluster0`;
