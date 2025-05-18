import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useAuth, useUser } from '@clerk/clerk-react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize companyToken from localStorage immediately
  const storedToken = localStorage.getItem('companyToken');

  // UI toggle for recruiter login cart/bracelet visibility
  const [recruiterLogin, setRecruiterLogin] = useState(false);

  // States
  const [searchFilter, setSearchFilter] = useState({ title: '', location: '' });
  const [isSearch, setIsSearch] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [companyToken, setCompanyToken] = useState(storedToken || null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userApplications, setUserApplications] = useState([]);

  // Fetch public jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  // Fetch company data
  const fetchCompanyData = async () => {
    try {
      console.log('Fetching company data with token:', companyToken);
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setCompanyData(data.company);
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoadingUserData(true);
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Fetch user applications
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/users/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserApplications(data.applications);
      } else {
        enqueueSnackbar(data.message || 'Failed to fetch applications', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to fetch applications', { variant: 'error' });
    }
  };

  // Login company
  const loginCompany = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/login`, { email, password });

      if (data.success) {
        localStorage.setItem('companyToken', data.token);
        setCompanyToken(data.token);
        // Do NOT toggle recruiterLogin here — control recruiterLogin UI separately
      } else {
        enqueueSnackbar(data.message || 'Login failed', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Login failed', { variant: 'error' });
    }
  };

  // Initial fetch for jobs only (companyToken state initialized above)
  useEffect(() => {
    fetchJobs();
  }, []);

  // Sync companyToken with localStorage and clear company data on logout
  useEffect(() => {
    console.log('companyToken changed:', companyToken);
    if (companyToken) {
      localStorage.setItem('companyToken', companyToken);
      // Do NOT change recruiterLogin here
    } else {
      localStorage.removeItem('companyToken');
      setCompanyData(null); // clear company data on logout
      // Do NOT change recruiterLogin here
    }
  }, [companyToken]);

  // Fetch company data when token changes
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  // Fetch user data and applications when signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [isSignedIn]);

  // Expose all state and functions
  const value = {
    searchFilter,
    setSearchFilter,
    isSearch,
    setIsSearch,
    jobs,
    setJobs,
    recruiterLogin,
    setRecruiterLogin, // use this manually in your UI to toggle visibility
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    isLoadingUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
    loginCompany,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
