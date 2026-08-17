import { useNavigate, useParams } from "react-router-dom"

function ScheduleDetail() {
    const navigate = useNavigate()
    const { studentId } = useParams()

    const handleDummySave = () => {
        navigate(`/summary/${studentId}`)
    }
    return (
        <div>
            <h1>Detail Sesi</h1>
            <p>Student Id : ${studentId}</p>
            <button onClick={handleDummySave}>Simpan</button>
        </div>
    )
}

export default ScheduleDetail