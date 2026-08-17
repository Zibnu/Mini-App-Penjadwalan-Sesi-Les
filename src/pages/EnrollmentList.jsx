import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaUserGraduate } from "react-icons/fa6"
import { supabase } from "../lib/supabase.js"
import StudentCard from "../components/StudentCard"
import Pagination from "../components/Pagination"

const ITEMS_PER_PAGE = 3

function EnrollmentList() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchStudents = async () => {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
            .from("enrollments")
            .select("id_student, student_name, program, session_package, session_duration, mode, created_at")
            .order("created_at", { ascending: false })

        if (error) {
            setError("Gagal memuat data siswa.")
            console.error(error)
        } else {
            setStudents(data || [])
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE) || 1

    // Ensure currentPage doesn't exceed totalPages if student count changes
    const validCurrentPage = Math.min(currentPage, totalPages)

    const paginatedStudents = students.slice(
        (validCurrentPage - 1) * ITEMS_PER_PAGE,
        validCurrentPage * ITEMS_PER_PAGE
    )

    return (
        <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#242829] tracking-tight">
                        Daftar Siswa
                    </h1>
                    <p className="text-xs sm:text-sm text-[#242829]/70 mt-0.5">
                        Kelola data pendaftaran dan jadwal les siswa.
                    </p>
                </div>

                <Link 
                    to="/register"
                    className="
                        inline-flex items-center gap-1.5 bg-[#026C7A] text-white text-xs sm:text-sm font-semibold
                        px-3.5 py-2.5 rounded-lg shadow-sm hover:bg-[#01545f] active:scale-[0.98] transition shrink-0 cursor-pointer
                    "
                >
                    <FaPlus size={11} />
                    <span>Tambah Siswa</span>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-3 border-[#026C7A]/30 border-t-[#026C7A] rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-[#242829]/60">Memuat data siswa...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center my-6">
                    <p>{error}</p>
                    <button
                        onClick={fetchStudents}
                        className="mt-3 text-xs bg-red-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-red-700 transition cursor-pointer"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {!loading && !error && students.length === 0 && (
                <div className="text-center py-16 px-4 bg-white border border-dashed border-gray-300 rounded-2xl">
                    <div className="w-14 h-14 rounded-full bg-[#026C7A]/10 text-[#026C7A] flex items-center justify-center mx-auto mb-3">
                        <FaUserGraduate size={26} />
                    </div>
                    <h2 className="text-base font-semibold text-[#242829] mb-1">Belum Ada Siswa</h2>
                    <p className="text-xs sm:text-sm text-[#242829]/70 max-w-sm mx-auto mb-4">
                        Belum ada siswa yang terdaftar. Klik tombol Tambah Siswa untuk mendaftarkan siswa baru.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-1.5 bg-[#026C7A] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#01545f] transition shadow-sm"
                    >
                        <FaPlus size={11} />
                        Tambah Siswa Baru
                    </Link>
                </div>
            )}

            {!loading && !error && students.length > 0 && (
                <div className="flex flex-col gap-3">
                    {paginatedStudents.map((student) => (
                        <StudentCard key={student.id_student} student={student} />
                    ))}

                    {/* Pagination 3 Items Per Page */}
                    <Pagination
                        currentPage={validCurrentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={students.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        itemName="siswa"
                    />
                </div>
            )}
        </div>
    )
}

export default EnrollmentList