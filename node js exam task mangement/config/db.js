import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // FIX: Check if MONGO_URL exists
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not defined");
        }

        // FIX: Add connection options to avoid deprecation warnings
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Database Connected");
    } catch (error) {
        // FIX: Log actual error message instead of entire error object
        console.log("Database Connection Failed:", error.message);
        
        // FIX: Exit process on connection failure (optional)
        process.exit(1);
    }
};

export default connectDB;