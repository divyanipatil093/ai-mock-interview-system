import express from "express"
import { googleAuth, logout, registerUser, loginUser } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/google", googleAuth)
authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.get("/logout", logout)

export default authRouter