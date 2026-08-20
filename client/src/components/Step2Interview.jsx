import React from "react";
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"

function Step2Interview({interviewData, onFinish}) {
    const {interviewId, questions,username} = interviewData


    return (
        <div  className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 
        flex iems-center justify-center [-4 sm:p-6">
            <div className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border
            border-gray-200 flex flex-col lg:flex-row overflow-hidden ">

                {/* video section*/}
                <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6
                space-y-6 border-r border-gray-200">
                    <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
                    <video                    
                     src={femaleVideo}
                     muted
                     playsInline
                     preload="auto"
                     className="w-full h-auto object-cover"
                     />
                </div>
                {/* subtitle pending */}



                {/* time Area */}

                <div className="w-full max-md bg-white border border-gray-200 rounded-2xl 
                shadow-md p-6 space-y-5"></div>
                </div>
            </div>
        </div>
    )
}

export default Step2Interview