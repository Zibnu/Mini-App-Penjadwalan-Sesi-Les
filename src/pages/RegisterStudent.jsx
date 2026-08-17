import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FaArrowLeft } from 'react-icons/fa6'
import { supabase } from "../lib/supabase"

const SESSION_PACKAGE_OPTIONS = [4, 8, 12]
const SESSION_DURATION_OPTIONS = [60, 90, 120]
const MODE_OPTIONS = [
    { value: "offline", label: "Datang ke rumah" },
    { value: "online", label: "Online" },
]

function RegisterStudent() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        student_name: "",
        program: "",
        session_package: null,
        session_duration: null,
        mode: null,
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const isFormValid = form.student_name.trim() !== "" &&
        form.program.trim() !== "" &&
        form.session_package !== null &&
        form.session_duration !== null &&
        form.mode !== null


    const handleTextChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const handleOptionSelect = (field, value) => () => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isFormValid) return

        setSubmitting(true)
        setError(null)

        const { data, error } = await supabase.from("enrollments").insert({
            student_name: form.student_name.trim(),
            program: form.program.trim(),
            session_package: form.session_package,
            session_duration: form.session_duration,
            mode: form.mode,
        }).select("id_student").single()

        if (error) {
            setError("Gagal menyimpan data siswa. coba lagi")
            console.error(error)
            setSubmitting(false)
            return
        }

        navigate(`/schedule/${data.id_student}`)
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <Link
                to="/"
                className="
                inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700
                mb-6
                "
            >
                <FaArrowLeft size={12} />
                Kembali
            </Link>


            <h1 className="text-xl font-bold text-gray-900 mb-1">Register Student</h1>
            <p className="text-sm text-gray-500 mb-6">Isi data hasil diskusi dengan orang tua siswa.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Siswa</label>
                    <input
                        type="text"
                        value={form.student_name}
                        onChange={handleTextChange("student_name")}
                        placeholder="Contoh: Jun Night Sky"
                        className="
                        w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        "
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program / Level Sekolah</label>
                    <input
                        type="text"
                        value={form.program}
                        onChange={handleTextChange("program")}
                        placeholder="Contoh: SMP"
                        className="
                        w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        "
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Sesi Paket</label>
                    <div className="flex gap-2">
                        {SESSION_PACKAGE_OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option}
                                onClick={handleOptionSelect("session_package", option)}
                                className={`
                                    flex-1 py-2 rounded-lg text-sm font-medium border
                                    transition ${form.session_package === option ?
                                        "bg-indigo-600 text-white border-indigo-600" :
                                        "bg-white text-gray-600 border-gray-300 hover:border-indigo-300"
                                    }
                                    `}>
                                {option} Sesi
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Per Sesi</label>
                    <div className="flex gap-2">
                        {SESSION_DURATION_OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option}
                                onClick={handleOptionSelect("session_duration", option)}
                                className={`
                                    flex-1 py-2 rounded-lg text-sm font-medium border
                                    transition ${form.session_duration === option ?
                                        "bg-indigo-600 text-white border-indigo-600" :
                                        "bg-white text-gray-600 border-gray-300 hover:border-indigo-300"
                                    }
                                    `}>
                                {option} Menit
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode Pembelajaran</label>
                    <div className="flex gap-2">
                        {MODE_OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={handleOptionSelect("mode", option.value)}
                                className={`
                                    flex-1 py-2 rounded-lg text-sm font-medium border
                                    transition ${form.mode === option.value ?
                                        "bg-indigo-600 text-white border-indigo-600" :
                                        "bg-white text-gray-600 border-gray-300 hover:border-indigo-300"
                                    }
                                    `}>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button 
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className="
                    w-full bg-indigo-600 text-white font-medium py-2.5
                    rounded-lg cursor-pointer hover:bg-indigo-700 transition disabled:bg-gray-300
                    disabled:cursor-not-allowed
                    "
                >
                        {submitting ? "Menyimpan..." : "Lanjut"}
                    </button>
            </form>
        </div>
    )
}

export default RegisterStudent