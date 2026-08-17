import { useNavigate } from "react-router-dom"
import { FaChevronRight } from "react-icons/fa6"

function StudentCard({student}) {
    const navigate = useNavigate()

    return (
        <button 
            onClick={() => navigate(`/summary/${student.id_student}`)}
            className="w-full flex items-center justify-between 
            bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-indigo-300
            hover:shadow-sm transition text-left"
        >
            <div>
                <p className="font-semibold text-gray-900">{student.student_name}</p>
                <p className="text-sm text-gray-500">{student.program}</p>
                <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                        {student.session_package} sesi {student.session_duration} menit
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                        student.mode === "online" ?
                        "bg-emerald-50 text-emerald-600" :
                        "bg-amber-50 text-amber-600"
                    }`}>
                        {student.mode === "online" ? "Online" : "Offline"}
                    </span>
                </div>
            </div>
            <FaChevronRight className="text-gray-300"/>
        </button>
    )
}

export default StudentCard