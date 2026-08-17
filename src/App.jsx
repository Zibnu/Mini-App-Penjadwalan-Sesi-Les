import { Routes, Route} from "react-router-dom"
import EnrollmentList from "./pages/EnrollmentList"
import RegisterStudent from "./pages/RegisterStudent"
import ScheduleDate from "./pages/ScheduleDate"
import ScheduleDetail from "./pages/ScheduleDetail"
import StudentSummary from "./pages/StudentSummary"


function App() {

  return (
    <Routes>
      <Route path="/" element={<EnrollmentList/>}/>
      <Route path="/register" element={<RegisterStudent/>}/>
      <Route path="/schedule/:studentId" element={<ScheduleDate/>}/>
      <Route path="/schedule/:studentId/detail" element={<ScheduleDetail/>}/>
      <Route path="/summary/:studentId" element={<StudentSummary/>}/>
    </Routes>
  )
}

export default App
