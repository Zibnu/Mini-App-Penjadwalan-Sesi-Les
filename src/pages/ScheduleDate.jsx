import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { FaArrowLeft } from 'react-icons/fa6'
import { supabase } from "../lib/supabase"
import Calendar from "../components/Calendar"
import { addDays, stripTime, formatDateKey } from "../utils/date"

function ScheduleDate() {
    const { studentId } = useParams()
    const navigate = useNavigate()

    const [selectedDate, setSelectedDate] = useState(null)
    const [markedDateKeys, setMarkedDateKeys] = useState(new Set())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const today = stripTime(new Date())
    const minDate = addDays(today, 4)

    const fetchExistingSessions = async () => {
        setLoading(true)
        setError(null)

        const {data, error} = await supabase.from("sessions").select("session_date").eq("student_id", studentId)

        if(error) {
            setError("Gagal memuat jadwal siswa")
            console.log(error)
        } else {
            setMarkedDateKeys(new Set(data.map((row) => row.session_date)))
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchExistingSessions()
    },[studentId])

    const handleNext = () => {
        if(!selectedDate) return
        navigate(`/schedule/${studentId}/detail`, {
            state: { selectedDate: formatDateKey(selectedDate)}
        })
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <Link
                to="/"
                className="
                inline-flex items-center gap-1.5 text-sm text-gray-500
                hover:text-gray-700 mb-6
                "
            >
                <FaArrowLeft size={12}/>
                Kembali
            </Link>

            <h1 className="text-xl font-bold text-gray-900 mb-1">Pilih tanggal</h1>
            <p className="text-sm text-gray-500 mb-6">Tanggal Les Paling Cepat H+3 dari hari ini</p>

            {loading && <p className="text-sm text-gray-400 text-center py-10">Memuat Calendar....</p>}
            {error && <p className="text-sm text-red-500 mb-6">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <Calendar
                        year={today.getFullYear()}
                        month={today.getMonth()}
                        selectedDate={selectedDate}
                        onSelectedDate={setSelectedDate}
                        minDate={minDate}
                        markedDateKeys={markedDateKeys}
                        today={today}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block shrink-0" />
                            <span>Sudah ada jadwal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded ring-1 ring-indigo-400 inline-block shrink-0" />
                            <span>Hari ini</span>
                        </div>
                    </div>

                    <button 
                        type="button"
                        disabled={!selectedDate}
                        onClick={handleNext}
                        className="
                        w-full mt-6 bg-indigo-600 text-white font-medium py-2.5 rounded-lg
                        hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed
                        "
                    >
                            Lanjut
                        </button>
                </>
            )}
        </div>
    )
}

export default ScheduleDate