import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const googleAuth = async (req, res) => {
    try {
        const {name, email} = req.body
        let user = await User.findOne({email})
        if(!user) {
            user = await User.create({
                name, email})
        }
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)



    } catch (error) {
        return res.status(500).json({message: `Google Auth Error: ${error}`})
    }
}


export const logout = async (req, res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({message: "Logout successful"})
    } catch (error) {
        return res.status(500).json({message: `Logout Error: ${error}`})
    }
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword })

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const userObj = user.toObject()
        delete userObj.password

        return res.status(201).json(userObj)

    } catch (error) {
        return res.status(500).json({ message: `Register Error: ${error}` })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." })
        }

        const user = await User.findOne({ email }).select("+password")
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const userObj = user.toObject()
        delete userObj.password

        return res.status(200).json(userObj)

    } catch (error) {
        return res.status(500).json({ message: `Login Error: ${error}` })
    }
}