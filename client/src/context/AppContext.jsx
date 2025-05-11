import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from 'notistack';
import { useAuth, useUser } from '@clerk/clerk-react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: ''
  });

  const [isSearch, setIsSearch] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [recruiterLogin, setRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  
  // Fetch public jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");
      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs)
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  // Fetch company data for authenticated company user
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl +"/api/company/company", {
        headers: { token: companyToken }
      });

      if (data.success) {
        setCompanyData(data.company);
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  // Fetch user data for authenticated user
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl+ "/api/users/user", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchJobs();

    const storedToken = localStorage.getItem('companyToken');
    if (storedToken) {
      setCompanyToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearch,
    setIsSearch,
    jobs,
    setJobs,
    recruiterLogin,
    setRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
