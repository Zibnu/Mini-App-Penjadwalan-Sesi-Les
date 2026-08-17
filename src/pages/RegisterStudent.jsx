import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6"
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

    const isFormValid =
        form.student_name.trim() !== "" &&
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

        const { data, error } = await supabase
            .from("enrollments")
            .insert({
                student_name: form.student_name.trim(),
                program: form.program.trim(),
                session_package: form.session_package,
                session_duration: form.session_duration,
                mode: form.mode,
            })
            .select("id_student")
            .single()

        if (error) {
            setError("Gagal menyimpan data siswa. Silakan coba lagi.")
            console.error(error)
            setSubmitting(false)
            return
        }

        navigate(`/schedule/${data.id_student}`)
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
                Registrasi Siswa
            </h1>
            <p className="text-xs sm:text-sm text-[#242829]/70 mb-6">
                Isi data pendaftaran hasil diskusi dengan orang tua siswa.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Nama Siswa */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#242829] mb-1.5">
                        Nama Siswa
                    </label>
                    <input
                        type="text"
                        value={form.student_name}
                        onChange={handleTextChange("student_name")}
                        placeholder="Contoh: Jun Night Sky"
                        className="
                            w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-[#242829]
                            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#026C7A] focus:border-[#026C7A] transition
                        "
                    />
                </div>

                {/* Program / Level Sekolah */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#242829] mb-1.5">
                        Program / Level Sekolah
                    </label>
                    <input
                        type="text"
                        value={form.program}
                        onChange={handleTextChange("program")}
                        placeholder="Contoh: SMP Kelas 8"
                        className="
                            w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-[#242829]
                            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#026C7A] focus:border-[#026C7A] transition
                        "
                    />
                </div>

                {/* Jumlah Sesi Paket */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#242829] mb-2">
                        Jumlah Sesi Paket
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {SESSION_PACKAGE_OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option}
                                onClick={handleOptionSelect("session_package", option)}
                                className={`
                                    py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold border transition cursor-pointer
                                    ${form.session_package === option
                                        ? "bg-[#026C7A] text-white border-[#026C7A] shadow-sm"
                                        : "bg-white text-[#242829] border-gray-300 hover:border-[#026C7A] hover:bg-[#026C7A]/5"
                                    }
                                `}
                            >
                                {option} Sesi
                            </button>
                        ))}
                    </div>
                </div>

                {/* Durasi Per Sesi */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#242829] mb-2">
                        Durasi Per Sesi
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {SESSION_DURATION_OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option}
                                onClick={handleOptionSelect("session_duration", option)}
                                className={`
                                    py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold border transition cursor-pointer
                                    ${form.session_duration === option
                                        ? "bg-[#026C7A] text-white border-[#026C7A] shadow-sm"
                                        : "bg-white text-[#242829] border-gray-300 hover:border-[#026C7A] hover:bg-[#026C7A]/5"
                                    }
                                `}
                            >
                                {option} Menit
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mode Pembelajaran */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#242829] mb-2">
                        Mode Pembelajaran
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {MODE_OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={handleOptionSelect("mode", option.value)}
                                className={`
                                    py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold border transition cursor-pointer
                                    ${form.mode === option.value
                                        ? "bg-[#026C7A] text-white border-[#026C7A] shadow-sm"
                                        : "bg-white text-[#242829] border-gray-300 hover:border-[#026C7A] hover:bg-[#026C7A]/5"
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className="
                        w-full bg-[#026C7A] text-white font-semibold py-3 px-4 mt-2
                        rounded-lg shadow-sm hover:bg-[#01545f] active:scale-[0.99] transition
                        cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                    "
                >
                    {submitting ? "Menyimpan..." : "Lanjut ke Pilih Tanggal"}
                </button>
            </form>
        </div>
    )
}

export default RegisterStudent