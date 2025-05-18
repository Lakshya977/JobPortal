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
    try {
        const { jobId } = req.body; // Fixed from jobID
        if (!jobId) {
            return res.status(400).json({ success: false, message: 'Please provide job id' });
        }
        const userId = req.auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (!user.resume) {
            return res.status(400).json({ success: false, message: 'Resume required' });
        }
        const isAlreadyApplied = await JobApplication.find({ userId, jobId });
        if (isAlreadyApplied.length > 0) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }
        const jobdata = await Job.findById(jobId);
        if (!jobdata) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        await JobApplication.create({
            userId,
            companyId: jobdata.companyID,
            jobId,
            resume: user.resume, // Added resume
            status: 'applied', // Explicitly set to match schema default
            date: Date.now(), // Explicitly set to match schema
        });
        res.status(200).json({ success: true, message: 'Applied successfully' });
    } catch (error) {
        console.error('applyForJob error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserAppliedApplications = async (req, res) => {
    try {
        const userId = req.auth?.userId; 
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name image')
            .populate('jobId', 'title location')
            .exec();
        if (applications.length === 0) {
            return res.status(200).json({ success: true, applications: [], message: 'No applications found' });
        }
        // Format for Applications table
        const formattedApplications = applications.map(app => ({
            logo: app.companyId?.image || '',
            company: app.companyId?.name || 'Unknown Company',
            title: app.jobId?.title || 'Unknown Job',
            location: app.jobId?.location || 'Unknown Location',
            date: new Date(app.date).toISOString(), // Convert timestamp to ISO string
            status: app.status || 'applied',
            jobId: app.jobId?._id || app.jobId,
        }));
        return res.status(200).json({ success: true, applications: formattedApplications });
    } catch (error) {
        console.error('getUserAppliedApplications error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth?.userId; 
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const resumefile = req.file; 
        if (!resumefile || !resumefile.path) {
            return res.status(400).json({ success: false, message: "Please provide a resume file" });
        }
        
        if (resumefile.mimetype !== 'application/pdf') {
            return res.status(400).json({ success: false, message: "Resume must be a PDF file" });
        }
        const userdata = await User.findById(userId);
        if (!userdata) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const resumeupload = await cloudinary.uploader.upload(resumefile.path, {
            resource_type: 'raw', 
            folder: 'resumes', 
        });
        userdata.resume = resumeupload.secure_url; 
        await userdata.save();
        res.status(200).json({ success: true, message: "Resume uploaded successfully", user: userdata }); // Fixed response
    } catch (error) {
        console.error('updateUserResume error:', error); 
        return res.status(500).json({ success: false, message: error.message });
    }
};