import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Home from './pages/Home';
import ApplyJob from './pages/ApplyJob';
import Applications from './pages/Applications';
import Recruiterlogin from './Components/Recruiterlogin';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import ManageJobs from './pages/ManageJobs';
import ViewApplications from './pages/ViewApplications';
import 'quill/dist/quill.snow.css';

const App = () => {
  const { recruiterLogin, companyToken } = useContext(AppContext);

  return (
    <SnackbarProvider maxSnack={3}>
      <div>
        {recruiterLogin && <Recruiterlogin />} {/* Show login when not logged in */}
        <Routes>
          <Route path="/applications" element={<Applications />} />
          <Route path="/" element={<Home />} />
          <Route path="/apply-job/:id" element={<ApplyJob />} />
          <Route path="/Applications/:id" element={<Applications />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="add-job" element={<AddJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplications />} />
          </Route>
        </Routes>
      </div>
    </SnackbarProvider>
  );
};

export default App;