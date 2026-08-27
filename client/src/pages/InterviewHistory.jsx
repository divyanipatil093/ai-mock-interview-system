import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { FaArrowLeft } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const [selectMode, setSelectMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState([])
    const [showConfirm, setShowConfirm] = useState(false)
    const [notice, setNotice] = useState("")
    const navigate = useNavigate()

    const fetchInterviews = async () => {
        try {
            const result = await axios.get(ServerUrl + "/api/interview/get-interview"
                , { withCredentials: true })
            setInterviews(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchInterviews()
    }, [])

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            setNotice("Please select at least one interview.")
            setTimeout(() => setNotice(""), 3000)
            return
        }
        setShowConfirm(true)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(ServerUrl + "/api/interview/delete-interviews", {
                data: { interviewIds: selectedIds },
                withCredentials: true
            })
            setInterviews((prev) => prev.filter((i) => !selectedIds.includes(i._id)))
            setSelectedIds([])
            setSelectMode(false)
            setShowConfirm(false)
        } catch (error) {
            console.log(error)
            setShowConfirm(false)
        }
    }

    const cancelSelection = () => {
        setSelectMode(false)
        setSelectedIds([])
        setNotice("")
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-10">
            <div className="w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto">

                <div className="mb-10 w-full flex items-start gap-4 flex-wrap justify-between">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="mt-1 p-3 rounded-full bg-white shadow
                        hover:shadow-md transition">
                            <FaArrowLeft className="text-gray-600" />
                        </button>

                        <div >
                            <h1 className="text-3xl font-bold flex-nowrap text-gray 800">
                                Interview History
                            </h1>
                            <p className="text-gray-500 m-2">
                                Track your past interview and performance reports
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {selectMode ? (
                            <>
                                <button
                                    onClick={handleDeleteSelected}
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                                >
                                    Delete Selected ({selectedIds.length})
                                </button>
                                <button
                                    onClick={cancelSelection}
                                    className="border border-gray-300 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setSelectMode(true)}
                                className="flex items-center gap-2 border border-red-200 bg-white 
                                text-red-600 px-5 py-2.5 rounded-full text-sm font-semibold 
                                hover:bg-red-50 hover:border-red-300 hover:text-red-700 
                                transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <FaTrash className="text-xs" />
                                Delete History
                            </button>
                        )}
                    </div>
                </div>

                {notice && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
                        {notice}
                    </div>
                )}

                {interviews.length === 0 ?
                    <div className="bg-white p-10 rounded-2xl shadow text-center">
                        <p className="text-gray-500">
                            No interviews found start your first interview.
                        </p>
                    </div>

                    :

                    <div className="grid gap-6">
                        {interviews.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => selectMode ? toggleSelect(item._id) : navigate(`/report/${item._id}`)}
                                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all
                    duration-300 cursor-pointer border border-gray-100 flex items-center gap-4">

                                {selectMode && (
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item._id)}
                                        onChange={() => toggleSelect(item._id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-5 h-5 accent-emerald-600 shrink-0"
                                    />
                                )}

                                <div className="flex-1 flex flex-col md:flex-row md:items-center
                        md:justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.role}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {item.experience} • {item.mode}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-2">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6">

                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-600">
                                                {item.finalScore || 0}/10
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Overall Score
                                            </p>
                                        </div>

                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "Completed"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>}

            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-[999] bg-black/30 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Interviews?</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            This will permanently delete {selectedIds.length} selected interview(s). This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 border border-gray-300 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InterviewHistory