import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6"
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

        const { data, error } = await supabase
            .from("sessions")
            .select("session_date")
            .eq("student_id", studentId)

        if (error) {
            setError("Gagal memuat jadwal siswa.")
            console.error(error)
        } else {
            setMarkedDateKeys(new Set((data || []).map((row) => row.session_date)))
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchExistingSessions()
    }, [studentId])

    const handleNext = () => {
        if (!selectedDate) return
        navigate(`/schedule/${studentId}/detail`, {
            state: { selectedDate: formatDateKey(selectedDate) }
        })
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#242829]/70 hover:text-[#026C7A] transition mb-6"
            >
                <FaArrowLeft size={12} />
                <span>Kembali ke Daftar Siswa</span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-bold text-[#242829] mb-1">
                Pilih Tanggal Sesi
            </h1>
            <p className="text-xs sm:text-sm text-[#242829]/70 mb-6">
                Tanggal les paling cepat H+3 dari hari ini sesuai ketentuan operasional.
            </p>

            {loading && (
                <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-3 border-[#026C7A]/30 border-t-[#026C7A] rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-[#242829]/60">Memuat kalender...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center my-6">
                    <p>{error}</p>
                    <button
                        onClick={fetchExistingSessions}
                        className="mt-3 text-xs bg-red-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-red-700 transition cursor-pointer"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
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

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-4 px-1 text-xs text-[#242829]/75">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#026C7A] inline-block shrink-0" />
                            <span>Sudah ada jadwal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded ring-2 ring-[#026C7A] inline-block shrink-0" />
                            <span>Hari ini</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded bg-gray-100 border border-gray-200 inline-block shrink-0" />
                            <span className="text-gray-400">Tidak tersedia</span>
                        </div>
                    </div>

                    <button 
                        type="button"
                        disabled={!selectedDate}
                        onClick={handleNext}
                        className="
                            w-full mt-6 bg-[#026C7A] text-white font-semibold py-3 px-4 rounded-lg
                            shadow-sm hover:bg-[#01545f] active:scale-[0.99] transition
                            cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                        "
                    >
                        Lanjut ke Detail Sesi
                    </button>
                </>
            )}
        </div>
    )
}

export default ScheduleDate