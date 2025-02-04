import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

global.mongoose = global.mongoose || { conn: null, promise: null };

async function connectDB(): Promise<Mongoose> {
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
        global.mongoose.promise = mongoose.connect(MONGODB_URI, {
            dbName: "my-dictionary",
            bufferCommands: false,
        }).then((mongoose) => {
            console.log("🟢 Connected to MongoDB!");
            return mongoose;
        }).catch((err) => {
            console.error("❌ MongoDB Connection Error:", err);
            throw err;
        });
    }

    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
}

export default connectDB;
