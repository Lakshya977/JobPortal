import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import {v2 as cloudinary} from "cloudinary";


export const getUser = async (req, res) => {
  const userId = req.auth?.userId; // Clerk sets userId (lowercase 'id')
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(userId); // Query using _id
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const applyForJob = async (req, res) => {
    try{
       const {jobID} = req.body;
         if(!jobID){
          return res.status(400).json({success:false, message: "Please provide job id"});
         }
         const userID = req.auth.userID;
        const isAlreadyApplied = await JobApplication.find({userID,jobID});
        if(isAlreadyApplied.length > 0){
            return res.status(400).json({success:false, message: "You have already applied for this job"});
        }
        const jobdata = await Job.findById(jobID);
        if(!jobdata){
            return res.status(404).json({success:false, message: "Job not found"});
        }
        await JobApplication.create({
            userId: userID,
            companyId: jobdata.companyID,
            jobId: jobID,

        })
        res.status(200).json({success:true,message: "Applied successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message });
    }
}

export const getUserAppliedApplications = async (req, res) => {
    try{
      const userId = req.auth.userID;
      const applications = await JobApplication.find({userId})
      .populate('companyId', 'name email image')
      .populate('jobId', 'title description location salary')
      .exec();
      if(!applications){
        return res.status(404).json({success:false, message: "No applications found"});
      }
        return res.status(200).json({success:true, applications});



    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message });
    }
}
export const updateUserResume = async (req, res) => {
    try{
     const userId = req.auth.userID;
        if(!userId){
            return res.status(400).json({success:false, message: "Please provide user id"});
        }
    const resumefile = req.resumeFile
    if(!resumefile){
        return res.status(400).json({success:false, message: "Please provide resume"});
    }
    const userdata =  await User.findById(userId); 
    if(!userdata){
        return res.status(404).json({success:false, message: "User not found"});
    }
    const resumeupload = await cloudinary.uploader.upload(resumefile.tempFilePath)
    userdata.resume = {
        public_id: resumeupload.public_id,
        url: resumeupload.secure_url,
    }
    await userdata.save();
    res.status(200).json({success:true,message: "Resume uploaded successfully", resume:userdata.resume});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message });
    }
}
