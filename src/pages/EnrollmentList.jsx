import { Link } from "react-router-dom"

function EnrollmentList() {
    return (
        <div>
            <h1>Enrollment List</h1>
            <Link to={"/register"}>+ Add student</Link>
        </div>
    )
}

export default EnrollmentList