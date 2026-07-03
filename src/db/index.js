import mongoose from "mongoose";
import { DB_NAME } from "./constants";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB connected! DB HOST: ${connectionInstance}`);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1); // Exit the process with an error code
    }
}
export default connectDB;