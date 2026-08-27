import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        default:100
    },
    password: {
        type: String,
        select: false
    }

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User