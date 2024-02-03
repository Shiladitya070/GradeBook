import { MONGO_URL } from "@/config";
import mongoose from "mongoose";


export async function connectDB() {
    try {
        console.log("🥲🥲🥲🥲", MONGO_URL)
        mongoose.connect(MONGO_URL);

        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("🟢", "Connection established successfully")
        })
        connection.on('error', () => {
            console.log("Connection error")
            process.exit()
        })
    } catch (error) {
        console.log("Something went wrong")
        console.log(error)
    }
}