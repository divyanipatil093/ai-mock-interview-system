import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { setUserData } from "./redux/userSlice";
import InterviewPage from "./pages/InterviewPage";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewReport from "./pages/InterviewReport";
import Pricing from "./pages/Pricing"; 
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

//export const ServerUrl = "http://localhost:8000"
export const ServerUrl = "https://ai-mock-interview-system-xacs.onrender.com"


function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl+ "/api/user/current-user", {withCredentials: true})
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  }, [dispatch])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/report/:id" element={<InterviewReport />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />

    </Routes>
  )
}

export default App
