import { Link, useParams } from "react-router-dom"

function StudentSummary() {
    const { studentId } = useParams()

    return (
        <div>
            <h1>Summary student</h1>
            <p>Student Id : ${studentId}</p>
            <Link to="/">Kembali Ke Student List</Link>
        </div>
    )
}

export default StudentSummary