import express from "express"
import dotenv from "dotenv"
dotenv.config()
console.log("JWT_SECRET is:", process.env.JWT_SECRET)
import connectDb from "./config/connectDb.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/inteview.route.js"
import resumeRouter from "./routes/resume.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    // origin: "https://ai-mock-interview-system-client.onrender.com",
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview",interviewRouter)
app.use("/api/resume",resumeRouter)
app.use("/api/payment",paymentRouter)


const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDb()
})