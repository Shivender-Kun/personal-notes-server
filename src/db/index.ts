import mongoose from "mongoose";
import { db_url } from "../config";

export const Schema = mongoose.Schema;
export const model = mongoose.model;

const DB = {
    connect() {
        try {
            mongoose.connect(db_url);
            const db = mongoose.connection;

            db.on("error", console.error.bind(console, "connection error"));
            db.once("open", () =>
                console.log(`Database connected successfully...`)
            );
        } catch (error) {
            console.error("MongoDB connection Error: ", error);
            process.exit(1);
        }
    },
};

export default DB;
