import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { useSnackbar } from 'notistack'; 
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const { enqueueSnackbar } = useSnackbar();
  
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
  const fetchjobdata = async()=>{
    //fetch company data using otken
    try {
      const {data} = await axios.get(backendUrl +"/api/company/company",{headers: {token:companytoken}})
      if(data.success){
      setcompanydata(data.company);
      console.log(data)

      }else{
        enqueueSnackbar(data.message,{variant:error})
      }
    } catch (error) {
      enqueueSnackbar(data.message,{variant:error})
    }
  }

  useEffect(() => {
    fetchJobs(); 
    const storedcompanytoken = localStorage.getItem('companytoken');
    if(storedcompanytoken){
      setcompanytoken(storedcompanytoken);

    }

  }, []);
  useEffect(()=>{
     if(companytoken){
      fetchjobdata();

     }
  },[companytoken])

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

export {AppContext};
