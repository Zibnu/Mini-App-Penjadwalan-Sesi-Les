import { useNavigate, useParams } from "react-router-dom"

function ScheduleDate() {
    const navigate = useNavigate()
    const { studentId } = useParams()

    const handleDummyNext = () => {
        navigate(`/schedule/${studentId}/detail`)
    }
    return (
        <div>
            <h1>Schedule Date</h1>
            <p>Student ID : ${studentId}</p>
            <button onClick={handleDummyNext}> Next: Detail Sesi</button>
        </div>
    )
}

export default ScheduleDate