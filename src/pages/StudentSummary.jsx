import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FaArrowLeft, FaHouse, FaPlus, FaCalendarDays, FaClock, FaLocationDot, FaBook, FaUserGraduate } from "react-icons/fa6"
import { supabase } from "../lib/supabase"
import { formatDateIndo } from "../utils/date"

function StudentSummary() {
    const { studentId } = useParams()
    const navigate = useNavigate()


    const [enrollment, setEnrollment] = useState(null)
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        if (!studentId) return
        setLoading(true)
        setError(null)

        try {
            // Fetch 2 sumber data secara paralel
            const [enrollmentRes, sessionsRes] = await Promise.all([
                supabase
                    .from("enrollments")
                    .select("*")
                    .eq("id_student", studentId)
                    .single(),
                supabase
                    .from("sessions")
                    .select("*")
                    .eq("student_id", studentId)
                    .order("session_date", { ascending: true })
                    .order("start_time", { ascending: true })
            ])

            if (enrollmentRes.error) throw enrollmentRes.error
            if (sessionsRes.error) throw sessionsRes.error

            setEnrollment(enrollmentRes.data)
            setSessions(sessionsRes.data || [])
        } catch (err) {
            console.error("Gagal memuat data ringkasan siswa:", err)
            setError("Gagal memuat ringkasan siswa. Silakan coba lagi.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [studentId])

    const filled = sessions.length
    const total = enrollment?.session_package || 0
    const isFull = total > 0 && filled >= total
    const progressPercentage = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            {/* Header Navigasi */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
                >
                    <FaArrowLeft size={12} />
                    <span>Daftar Siswa</span>
                </Link>
            </div>

            {loading && (
                <p className="text-sm text-gray-400 text-center py-12">Memuat ringkasan siswa...</p>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center my-6">
                    <p>{error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-3 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {!loading && !error && enrollment && (
                <>
                    {/* Kartu Informasi Siswa & Progres */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{enrollment.student_name}</h1>
                                <p className="text-sm text-gray-500">{enrollment.program}</p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                enrollment.mode === "online"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                                {enrollment.mode === "online" ? "Online" : "Datang ke rumah"}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                            <span className="bg-gray-100 px-2.5 py-1 rounded-lg">
                                Paket: <strong>{enrollment.session_package} Sesi</strong>
                            </span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-lg">
                                Durasi: <strong>{enrollment.session_duration} Menit / Sesi</strong>
                            </span>
                        </div>

                        {/* Progress Bar Sesi */}
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs mb-1.5">
                                <span className="font-medium text-gray-600">Progres Jadwal</span>
                                <span className="font-semibold text-indigo-600">
                                    {filled} dari {total} sesi ({progressPercentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        isFull ? "bg-emerald-500" : "bg-indigo-600"
                                    }`}
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            {isFull && (
                                <p className="text-[11px] text-emerald-600 mt-1.5 font-medium">
                                    ✓ Semua sesi paket telah lengkap dijadwalkan.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Judul List & Tombol Tambah Sesi */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Daftar Sesi</h2>
                            <p className="text-xs text-gray-500">Urutan kronologis tanggal dan jam les.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate(`/schedule/${studentId}`)}
                            disabled={isFull}
                            className={`
                                inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg transition
                                ${isFull
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm"}
                            `}
                        >
                            <FaPlus size={11} />
                            <span>{isFull ? "Paket Penuh" : "Tambah Sesi"}</span>
                        </button>
                    </div>

                    {/* Empty State jika belum ada sesi */}
                    {sessions.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400">
                            <FaCalendarDays size={32} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm font-medium text-gray-600">Belum ada sesi yang dijadwalkan</p>
                            <p className="text-xs text-gray-400 mt-1 mb-4">Mulai atur tanggal dan jam les siswa sekarang.</p>
                            <button
                                onClick={() => navigate(`/schedule/${studentId}`)}
                                className="inline-flex items-center gap-1.5 text-xs bg-indigo-600 text-white font-medium px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                <FaPlus size={11} />
                                Atur Sesi Pertama
                            </button>
                        </div>
                    ) : (
                        /* Daftar Card Sesi (Kronologis) */
                        <div className="flex flex-col gap-3">
                            {sessions.map((session, index) => (
                                <div
                                    key={session.id_session || index}
                                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-gray-300 transition"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                                            Sesi {index + 1}
                                        </span>
                                        <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                                            <FaCalendarDays size={12} className="text-gray-400" />
                                            {formatDateIndo(session.session_date, true)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-3 pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5">
                                            <FaClock size={12} className="text-gray-400 shrink-0" />
                                            <span>{session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)} WIB</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaLocationDot size={12} className="text-gray-400 shrink-0" />
                                            <span className="truncate" title={session.location}>{session.location}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-2.5 text-xs">
                                        <div className="flex items-start gap-1.5 text-gray-700">
                                            <FaBook size={12} className="text-gray-400 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-medium text-gray-500 block text-[11px]">Materi:</span>
                                                <span className="text-gray-800">{session.material}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default StudentSummary