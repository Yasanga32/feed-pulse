import mongoose from "mongoose";


export const connectDB = async () => {
    try {

        mongoose.connection.on("connected", () => console.log("Connected to MongoDB"))

        await mongoose.connect(`${process.env.MONGODB_URL}/feedpulse`)

    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
}