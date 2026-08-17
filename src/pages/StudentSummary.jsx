import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FaArrowLeft, FaPlus, FaCalendarDays, FaClock, FaLocationDot, FaBook } from "react-icons/fa6"
import { supabase } from "../lib/supabase"
import { formatDateIndo } from "../utils/date"
import Pagination from "../components/Pagination"

const ITEMS_PER_PAGE = 3

function StudentSummary() {
    const { studentId } = useParams()
    const navigate = useNavigate()

    const [enrollment, setEnrollment] = useState(null)
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchData = async () => {
        if (!studentId) return
        setLoading(true)
        setError(null)

        try {
            // Fetch 2 data sources in parallel
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

    // Pagination calculations
    const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE) || 1
    const validCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE
    const paginatedSessions = sessions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return (
        <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
            {/* Header Navigasi */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#242829]/70 hover:text-[#026C7A] transition"
                >
                    <FaArrowLeft size={12} />
                    <span>Kembali ke Daftar Siswa</span>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-3 border-[#026C7A]/30 border-t-[#026C7A] rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-[#242829]/60">Memuat ringkasan siswa...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center my-6">
                    <p>{error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-3 text-xs bg-red-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-red-700 transition cursor-pointer"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {!loading && !error && enrollment && (
                <>
                    {/* Kartu Informasi Siswa & Progres */}
                    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 mb-6 shadow-sm">
                        <div className="flex items-start justify-between mb-3 gap-2">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-[#242829]">
                                    {enrollment.student_name}
                                </h1>
                                <p className="text-xs sm:text-sm text-[#242829]/70 mt-0.5">
                                    {enrollment.program}
                                </p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                                enrollment.mode === "online"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-[#FBC84F]/25 text-[#7a5300] border border-[#FBC84F]/60"
                            }`}>
                                {enrollment.mode === "online" ? "Online" : "Datang ke rumah"}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-[#242829]/80 mb-4">
                            <span className="bg-gray-100 px-2.5 py-1 rounded-lg">
                                Paket: <strong className="text-[#242829]">{enrollment.session_package} Sesi</strong>
                            </span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-lg">
                                Durasi: <strong className="text-[#242829]">{enrollment.session_duration} Menit / Sesi</strong>
                            </span>
                        </div>

                        {/* Progress Bar Sesi */}
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs mb-1.5">
                                <span className="font-medium text-[#242829]/70">Progres Jadwal</span>
                                <span className="font-bold text-[#026C7A]">
                                    {filled} dari {total} sesi ({progressPercentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        isFull ? "bg-emerald-500" : "bg-[#026C7A]"
                                    }`}
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            {isFull && (
                                <p className="text-[11px] text-emerald-700 mt-2 font-semibold flex items-center gap-1">
                                    <span>✓</span> Semua sesi paket telah lengkap dijadwalkan.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Judul List & Tombol Tambah Sesi */}
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-[#242829]">Daftar Sesi</h2>
                            <p className="text-xs text-[#242829]/70">Urutan kronologis tanggal dan jam les.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate(`/schedule/${studentId}`)}
                            disabled={isFull}
                            className={`
                                inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition shrink-0
                                ${isFull
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[#026C7A] text-white hover:bg-[#01545f] active:scale-[0.98] cursor-pointer shadow-sm"}
                            `}
                        >
                            <FaPlus size={11} />
                            <span>{isFull ? "Paket Penuh" : "Tambah Sesi"}</span>
                        </button>
                    </div>

                    {/* Empty State jika belum ada sesi */}
                    {sessions.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-[#026C7A]/10 text-[#026C7A] flex items-center justify-center mx-auto mb-3">
                                <FaCalendarDays size={22} />
                            </div>
                            <p className="text-sm font-semibold text-[#242829]">Belum ada sesi yang dijadwalkan</p>
                            <p className="text-xs text-[#242829]/70 mt-1 mb-4">Mulai atur tanggal dan jam les siswa sekarang.</p>
                            <button
                                onClick={() => navigate(`/schedule/${studentId}`)}
                                className="inline-flex items-center gap-1.5 text-xs bg-[#026C7A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#01545f] transition shadow-sm cursor-pointer"
                            >
                                <FaPlus size={11} />
                                Atur Sesi Pertama
                            </button>
                        </div>
                    ) : (
                        /* Daftar Card Sesi (Kronologis Paginated 3 Items/Page) */
                        <div className="flex flex-col gap-3">
                            {paginatedSessions.map((session, index) => {
                                const globalIndex = startIndex + index + 1
                                return (
                                    <div
                                        key={session.id_session || `${session.session_date}-${session.start_time}-${index}`}
                                        className="bg-white border border-gray-200/90 rounded-xl p-4 shadow-sm hover:border-[#026C7A]/40 transition"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-[#026C7A] bg-[#026C7A]/10 px-2.5 py-0.5 rounded-full">
                                                Sesi {globalIndex}
                                            </span>
                                            <span className="text-xs font-medium text-[#242829] flex items-center gap-1.5">
                                                <FaCalendarDays size={12} className="text-[#026C7A]" />
                                                {formatDateIndo(session.session_date, true)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#242829]/80 mb-3 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5">
                                                <FaClock size={12} className="text-[#026C7A]/80 shrink-0" />
                                                <span className="font-medium text-[#242829]">{session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)} WIB</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FaLocationDot size={12} className="text-[#026C7A]/80 shrink-0" />
                                                <span className="truncate text-[#242829]" title={session.location}>{session.location}</span>
                                            </div>
                                        </div>

                                        <div className="bg-[#F9FAFD] border border-gray-100 rounded-lg p-2.5 text-xs">
                                            <div className="flex items-start gap-1.5">
                                                <FaBook size={12} className="text-[#026C7A]/80 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-semibold text-[#242829]/60 block text-[11px]">Materi:</span>
                                                    <span className="text-[#242829] font-medium">{session.material}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Pagination 3 Items Per Page */}
                            <Pagination
                                currentPage={validCurrentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={sessions.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                itemName="sesi"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default StudentSummary