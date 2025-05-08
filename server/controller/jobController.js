import Job from '../models/Job.js';
import mongoose from 'mongoose';
import Company from '../models/Company.js';

//get all jobs
export const getAllJobs = async (req, res) => {
try{
    const jobs = await Job
    .find({visible:true})
    .populate({path:'companyID',select:'-password'});
    return res.status(200).json({success:true, jobs});
}catch(error){
    console.log(error);
    return res.status(500).json({success:false, message: error.message });
}
}
//get a single job by id
export const getJobById = async (req, res) => {
    try {
      const { id } = req.params; 
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid job ID" });
      }
  
      const job = await Job.findById(id)
        .populate({ path: 'companyID', select: '-password' });
  
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      return res.status(200).json({ success: true, job });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  