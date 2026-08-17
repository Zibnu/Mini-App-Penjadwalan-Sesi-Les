import { useNavigate } from "react-router-dom"
import { FaChevronRight } from "react-icons/fa6"

function StudentCard({ student }) {
    const navigate = useNavigate()

    return (
        <button 
            type="button"
            onClick={() => navigate(`/summary/${student.id_student}`)}
            className="
                group w-full flex items-center justify-between 
                bg-white border border-gray-200/90 rounded-xl p-4
                hover:border-[#026C7A]/50 hover:shadow-sm transition-all duration-200 text-left
                cursor-pointer active:scale-[0.995]
            "
        >
            <div className="flex-1 pr-3">
                <p className="font-bold text-base text-[#242829] group-hover:text-[#026C7A] transition-colors">
                    {student.student_name}
                </p>
                <p className="text-xs sm:text-sm text-[#242829]/70 mt-0.5">
                    {student.program}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#026C7A]/10 text-[#026C7A]">
                        {student.session_package} sesi · {student.session_duration} menit
                    </span>
                    <span className={`text-[11px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        student.mode === "online" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-[#FBC84F]/25 text-[#7a5300] border border-[#FBC84F]/60"
                    }`}>
                        {student.mode === "online" ? "Online" : "Datang ke rumah"}
                    </span>
                </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#026C7A]/10 flex items-center justify-center transition shrink-0">
                <FaChevronRight className="text-gray-400 group-hover:text-[#026C7A] text-xs transition" />
            </div>
        </button>
    )
}

export default StudentCard