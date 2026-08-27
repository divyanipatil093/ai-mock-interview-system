import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../utils/firebase';
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useState } from "react";

function Auth({isModel = false}) {
  const dispatch = useDispatch()
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload = mode === "signup"
        ? form
        : { email: form.email, password: form.password };

      const result = await axios.post(ServerUrl + endpoint, payload, { withCredentials: true });
      dispatch(setUserData(result.data));
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
        const response = await signInWithPopup(auth, provider)
        let User = response.user
        let name = User.displayName
        let email = User.email
        const result = await axios.post(ServerUrl + "/api/auth/google", 
          {name, email}, {withCredentials: true})
        dispatch(setUserData(result.data))
          
    }catch (error) {
        console.log(error)
          dispatch(setUserData(null))
    }
  }
  return (
    <div className={`
    w-full 
    ${isModel ? "py-4" : " min-h-screen bg-[#f3f3f3] flex justify-center items-center px-6 py-20"}
    `}>
      <motion.div 
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.05 }}
      className={`
      w-full 
      ${isModel ? "max-w-md p-8 rounded-3xl":"max-w-lg p-12 rounded-[32px]"}
        bg-white shadow-2xl border border-gray-200
      `}>

        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <BsRobot size={18} />

        </div>
        <h2 className='font-semibold text-lg'>InterviewIQ.AI </h2>
      </div>
      <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
        Continue with
        <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex item-center gap-2'>
             <IoSparkles size={16} className='self-center ' />
             AI Smart Interviewer
        </span>
      </h1>
      <p className='text-center text-gray-500 text-sm md:text-base leading-relaxed mb-8'>
        Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
      </p>
    
                <motion.button 
        onClick={handleGoogleAuth}
        whileHover={{ opacity: 0.9, scale: 1.03 }}
        whileTap={{ opacity: 1, scale: 0.97 }}
        className='w-full flex items-center justify-center gap-3 bg-black text-white py-3 
        rounded-full shadow-md'>
            <FcGoogle size={20} />
            Continue with Google

        </motion.button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text" placeholder="Full Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          )}
          <input
            type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          {mode === "signup" && (
            <input
              type="password" placeholder="Confirm Password" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full disabled:bg-gray-400 bg-green-600
            hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold
            transition duration-300 shadow-md"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
            className="text-green-600 font-semibold"
          >
            {mode === "signup" ? "Login" : "Sign Up"}
          </button>
        </p>
       </motion.div>
    
    </div>
  )
}

export default Auth