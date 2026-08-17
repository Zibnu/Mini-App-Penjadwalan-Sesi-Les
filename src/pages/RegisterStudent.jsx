import { useNavigate } from "react-router-dom"

function RegisterStudent() {
    const navigate = useNavigate()

    const handleDummySubmit = () => {
        navigate("/schedule/dummy-id")
    }
    return (
        <div>
            <h1>Regis</h1>
            <button onClick={handleDummySubmit}>Next: Pilih Tanggal</button>
        </div>
    )
}

export default RegisterStudent