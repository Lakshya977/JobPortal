import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: ''
  });

  const [isSearch, setIsSearch] = useState(false);
  const [jobs, setJobs] = useState([]);
  const[recruiterlogin,setrecruiterlogin]= useState(false)

 const[companytoken,setcompanytoken]= useState(null)
 const[companydata,setcompanydata]= useState(null)	 
 
 
 
 const fetchJobs = async () => {
    setJobs(jobsData);
  };

  useEffect(() => {
    fetchJobs(); 
  }, []);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearch,
    setIsSearch,
    jobs,
    setJobs,
    recruiterlogin,
    setrecruiterlogin,
    companytoken
    ,setcompanytoken,
    companydata,setcompanydata,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
