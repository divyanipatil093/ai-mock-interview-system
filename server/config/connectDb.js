import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DataBase Connected")
    } catch (error) {
        console.error("Database Error:", error)
        
    }
}

export default connectDb

