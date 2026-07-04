import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//DNS resolution issue fix
import dns from"dns";
dns.setServers(["1.1.1.1","8.8.8.8"]);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection Error:", error);
        process.exit(1); // Exit the process with an error code
    }
}
export default connectDB;