import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaUserGraduate } from 'react-icons/fa6'
import { supabase } from "../lib/supabase.js"
import StudentCard from "../components/StudentCard"

function EnrollmentList() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    
    const fetchStudents = async () => {
        setLoading(true)
        setError(null)

        const {data, error} = await supabase
        .from("enrollments")
        .select("id_student, student_name, program, session_package, session_duration, mode, created_at")
        .order("created_at", { ascending : false })

        if(error) {
            setError("Failed get Data Student")
            console.error(error)
        } else {
            setStudents(data)
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchStudents()
    }, [])
    
    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900">
                    Enrollment list
                </h1>

                <Link 
                    to="/register"
                    className="flex items-center gap1.5 bg-indigo-600 text-white text-sm font-medium px-3 py-2 rounded-lg
                        hover:bg-indigo-700 transition
                    "
                >
                        <FaPlus size={12}/>
                        Add Student
                    </Link>
            </div>

            {loading && (
                <p className="text-sm text-gray-400 text-center py-10">Memuat Data...</p>
            )}

            {error && (
                <p className="text-sm text-red-500 text-center py-10">{error}</p>
            )}

            {!loading && !error && students.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <FaUserGraduate size={32} className="mx-auto mb-3"/>
                    <p className="text-sm">Belum Ada Siswa Yang mendaftar.</p>
                    <p className="text-sm">Klik "Add Student" Untuk mendaftarkan siswa Baru.</p>
                </div>
            )}

            {!loading && !error && students.length > 0 && (
                <div className="flex flex-col gap-3">
                    {
                        students.map((student) => (
                            <StudentCard key={student.id_student} student={student}/>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default EnrollmentList