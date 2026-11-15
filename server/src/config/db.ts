import mongoose from "mongoose"
import { IS_DEV, MONGO_URI } from "./env.js"

export const connectDB = async () => {
    mongoose.set("strictQuery", true)
    mongoose.set("autoIndex", IS_DEV)
    await mongoose.connect(MONGO_URI)
    console.log("MongoDB connected:", mongoose.connection.name)
}

export const disconnectDB = () => mongoose.disconnect()
