import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FaArrowLeft, FaFileUpload } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";

function ResumeAnalyzer() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!file) return;
        setAnalyzing(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("resume", file);
            const res = await axios.post(ServerUrl + "/api/resume/analyze", formData, {
                withCredentials: true,
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to analyze resume.");
        } finally {
            setAnalyzing(false);
        }
    };

    const statusColor = result?.atsFriendly === "Yes"
        ? "text-emerald-600"
        : result?.atsFriendly === "Mostly"
        ? "text-yellow-600"
        : "text-red-600";

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex items-start gap-5">
                    <button
                        onClick={() => navigate("/")}
                        className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
                    >
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Resume ATS Analyzer</h1>
                        <p className="text-gray-500 mt-1">
                            Upload your resume to check its ATS compatibility
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <div
                        onClick={() => document.getElementById("atsResumeUpload").click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center
                        cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                    >
                        <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />
                        <input
                            type="file"
                            accept="application/pdf"
                            id="atsResumeUpload"
                            className="hidden"
                            onChange={(e) => { setFile(e.target.files[0]); setResult(null); }}
                        />
                        <p className="text-gray-600 font-medium">
                            {file ? file.name : "Click to upload resume (PDF)"}
                        </p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAnalyze}
                        disabled={!file || analyzing}
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400
                        text-white py-3 rounded-full font-semibold transition"
                    >
                        {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>

                                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-lg p-8 mt-6 space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-sm text-gray-500">ATS Score</p>
                                <p className="text-3xl font-bold text-emerald-600">
                                    {result.atsScore} / 10
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">ATS Status</p>
                                <p className={`text-xl font-semibold ${statusColor}`}>
                                    {result.atsFriendly === "Yes" ? "ATS Friendly" :
                                     result.atsFriendly === "Mostly" ? "Mostly ATS Friendly" :
                                     "Not ATS Friendly"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Strengths</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                                <h3 className="font-semibold text-red-700 mb-3">Issues Found</h3>
                                <ul className="space-y-2">
                                    {result.issues?.map((issue, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                                            <span className="shrink-0 w-5 h-5 rounded-full bg-red-500 text-white
                                            text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                            <span>{issue}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                                <h3 className="font-semibold text-emerald-700 mb-3">Recommended Fixes</h3>
                                <ul className="space-y-2">
                                    {result.fixes?.map((fix, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                                            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white
                                            text-xs font-bold flex items-center justify-center">✓</span>
                                            <span>{fix}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                            <h3 className="font-semibold text-yellow-700 mb-3">Improvement Suggestions</h3>
                            <ul className="space-y-2">
                                {result.suggestions?.map((s, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                                        <span className="shrink-0 w-5 h-5 rounded-full bg-yellow-500 text-white
                                        text-xs font-bold flex items-center justify-center">!</span>
                                        <span>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Recommended Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.keywords?.map((k, i) => (
                                    <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default ResumeAnalyzer;