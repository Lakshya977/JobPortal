import React, { useContext } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/applications'
import Recruiterlogin from './Components/recruiterlogin'
import AppContext from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css' 

const App = () => {
  const {recruiterlogin} = useContext(AppContext)
  return (
    <div>
      {recruiterlogin && <Recruiterlogin></Recruiterlogin>}
        <Routes>
        <Route path="/applications" element={<Applications />} />
            <Route path='/' element={<Home/>} />
            <Route path='/apply-job/:id' element={<ApplyJob/>}/>
            <Route path= '/Applications/:id' element={<Applications/>}/>
            <Route path="/dashboard" element={<Dashboard />}>
                <Route path="add-job" element={<AddJob />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
                <Route path="view-applications" element={<ViewApplications />} />
            </Route>
        </Routes>
    </div>
  )
}

export default App