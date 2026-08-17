import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation, Link } from "react-router-dom"
import { FaArrowLeft, FaTriangleExclamation, FaClock, FaCalendarDays } from "react-icons/fa6"
import { supabase } from "../lib/supabase"
import { calculateEndTime, isTimeOverlap, isBeforeOperationalHours, isExceedingOperationalHours } from "../utils/time"

function ScheduleDetail() {
    const { studentId } = useParams()
    const navigate = useNavigate()
    const locationState = useLocation()
    const selectedDate = locationState.state?.selectedDate

    const [enrollment, setEnrollment] = useState(null)
    const [existingSessions, setExistingSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState(null)

    const [startTime, setStartTime] = useState("")
    const [location, setLocation] = useState("")
    const [material, setMaterial] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)

    // Guard: Redirect back if selectedDate is missing
    useEffect(() => {
        if (!selectedDate) {
            navigate(`/schedule/${studentId}`, { replace: true })
        }
    }, [selectedDate, studentId, navigate])

    // Fetch enrollment and existing sessions on selectedDate
    useEffect(() => {
        if (!selectedDate || !studentId) return

        const fetchData = async () => {
            setLoading(true)
            setFetchError(null)

            try {
                // 1. Fetch enrollment data
                const { data: enrollmentData, error: enrollmentError } = await supabase
                    .from("enrollments")
                    .select("id_student, student_name, mode, session_duration")
                    .eq("id_student", studentId)
                    .single()

                if (enrollmentError) throw enrollmentError

                setEnrollment(enrollmentData)
                if (enrollmentData.mode === "online") {
                    setLocation("Online")
                } else {
                    setLocation("")
                }

                // 2. Fetch existing sessions for this student on the selected date
                const { data: sessionsData, error: sessionsError } = await supabase
                    .from("sessions")
                    .select("start_time, end_time")
                    .eq("student_id", studentId)
                    .eq("session_date", selectedDate)

                if (sessionsError) throw sessionsError

                setExistingSessions(sessionsData || [])
            } catch (err) {
                console.error("Gagal memuat data:", err)
                setFetchError("Gagal memuat data siswa atau jadwal sesi. Silakan coba lagi.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [studentId, selectedDate])

    // Calculate end_time dynamically
    const endTime = startTime && enrollment?.session_duration
        ? calculateEndTime(startTime, enrollment.session_duration)
        : ""

    // Check independent warning conditions
    const isStartTooEarly = Boolean(startTime && isBeforeOperationalHours(startTime, "07:00"))
    const isEndTooLate = Boolean(endTime && isExceedingOperationalHours(endTime, "20:00"))
    const isOperationalWarning = isStartTooEarly || isEndTooLate

    const isOverlapWarning = Boolean(
        startTime &&
        endTime &&
        existingSessions.some((session) =>
            isTimeOverlap(startTime, endTime, session.start_time, session.end_time)
        )
    )

    const isFormValid =
        Boolean(startTime) &&
        Boolean(endTime) &&
        !isOperationalWarning &&
        !isOverlapWarning &&
        location.trim() !== "" &&
        material.trim() !== ""

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isFormValid || submitting) return

        setSubmitting(true)
        setSubmitError(null)

        const { error } = await supabase.from("sessions").insert({
            student_id: studentId,
            session_date: selectedDate,
            start_time: startTime,
            end_time: endTime,
            location: location.trim(),
            material: material.trim(),
        })

        if (error) {
            console.error("Error inserting session:", error)
            setSubmitError("Gagal menyimpan sesi les. Silakan coba lagi.")
            setSubmitting(false)
            return
        }

        navigate(`/summary/${studentId}`)
    }

    if (!selectedDate) {
        return null
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <Link
                to={`/schedule/${studentId}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
                <FaArrowLeft size={12} />
                Kembali ke Pilih Tanggal
            </Link>

            <h1 className="text-xl font-bold text-gray-900 mb-1">Detail Sesi</h1>
            <p className="text-sm text-gray-500 mb-6">Tentukan jam mulai, materi, dan lokasi sesi belajar.</p>

            {loading && <p className="text-sm text-gray-400 text-center py-10">Memuat data sesi...</p>}
            {fetchError && <p className="text-sm text-red-500 text-center py-10">{fetchError}</p>}

            {!loading && !fetchError && enrollment && (
                <>
                    {/* Ringkasan Siswa & Tanggal Terpilih */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-900">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <span className="font-semibold text-base">{enrollment.student_name}</span>
                                <span className="text-indigo-600 text-xs ml-2">({enrollment.program})</span>
                            </div>
                            <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded font-medium capitalize">
                                {enrollment.mode}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-indigo-700">
                            <div className="flex items-center gap-1.5">
                                <FaCalendarDays size={12} />
                                <span>Tanggal: <strong>{selectedDate}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaClock size={12} />
                                <span>Durasi: <strong>{enrollment.session_duration} Menit</strong></span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Jam Mulai & Jam Selesai */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jam Mulai
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jam Selesai
                                </label>
                                <input
                                    type="text"
                                    value={endTime ? `${endTime} WIB` : "-"}
                                    disabled
                                    className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>

                        {/* Warnings (bisa muncul bersamaan) */}
                        {isOperationalWarning && (
                            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                                <FaTriangleExclamation size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-xs uppercase tracking-wide">Peringatan Jam Operasional</p>
                                    <p className="text-xs mt-0.5">
                                        {isStartTooEarly && isEndTooLate ? (
                                            <>Sesi ({startTime} - {endTime}) berada di luar jam operasional bimbingan belajar (<strong>07:00 - 20:00</strong>).</>
                                        ) : isStartTooEarly ? (
                                            <>Sesi dimulai pukul <strong>{startTime}</strong>. Jam operasional bimbingan belajar paling awal dimulai pukul <strong>07:00</strong>.</>
                                        ) : (
                                            <>Sesi berakhir pukul <strong>{endTime}</strong>. Jam operasional bimbingan belajar maksimal berakhir pukul <strong>20:00</strong>.</>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {isOverlapWarning && (
                            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                                <FaTriangleExclamation size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-xs uppercase tracking-wide">Peringatan Bentrok Jadwal</p>
                                    <p className="text-xs mt-0.5">
                                        Jam sesi ({startTime} - {endTime}) bentrok dengan jadwal sesi yang sudah ada pada tanggal ini.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Input Lokasi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lokasi Belajar
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                disabled={enrollment.mode === "online"}
                                placeholder={enrollment.mode === "online" ? "Online" : "Contoh: Jl. Kaliurang KM 5, Sleman"}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    enrollment.mode === "online"
                                        ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                        : "border-gray-300 text-gray-900 bg-white"
                                }`}
                                required
                            />
                            {enrollment.mode === "online" && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Otomatis terisi karena siswa memilih mode online.
                                </p>
                            )}
                        </div>

                        {/* Input Materi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Materi Pembelajaran
                            </label>
                            <input
                                type="text"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                placeholder="Contoh: Matematika - Aljabar & Persamaan Linear"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        {submitError && (
                            <p className="text-sm text-red-500">{submitError}</p>
                        )}

                        {/* Tombol Simpan */}
                        <button
                            type="submit"
                            disabled={!isFormValid || submitting}
                            className="
                                w-full mt-2 bg-indigo-600 text-white font-medium py-2.5 rounded-lg
                                hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed
                            "
                        >
                            {submitting ? "Menyimpan Sesi..." : "Simpan Sesi"}
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}

export default ScheduleDetail