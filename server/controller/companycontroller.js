import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";  // Add this import

// register a new company
export const registerCompany = async (req, res) => {
    
       const {name, email,password} = req.body;
    const image = req.file;

    if (!name || !email || !password || !image) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    try{
      const companyexists = await Company.findOne({ email });
      if(companyexists) {
         return res.json({ success:false,message: "Company already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const imageUpload = await cloudinary.uploader.upload(image.path);
      const company = await Company.create({
        name,
        email,
        password: hashedPassword,
        image: imageUpload.secure_url,
      })
      return res.json({ success: true, message: "Company registered successfully", company:{
        _id : company._id,
        name : company.name,
        email : company.email,
        image : company.image,
      },token: generateToken(company._id) 
     });

    } catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: "Internal server error" });
    }
    

}

export const loginCompany = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }
  
    try {
      const company = await Company.findOne({ email });
  
      if (!company) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, company.password);
  
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Login successful",
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

export const getCompanyData = async (req, res) => {
   
    try{
         const company = req.company
         res.json({success:true, company});

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message });
    }
}
export const postjob = async (req, res) => {
    const {title, description, location, salary,level,category} = req.body;
    if(!title || !description || !location || !salary){
        return res.status(400).json({success:false, message: "Please fill all fields"});
    } 
    const companyID = req.company._id;
    try{
        const newjob = new Job({
            title ,
            description,
            location,
            salary,
            companyID: companyID,
            date: Date.now(),
            level,
            category,
        })
        await newjob.save();
        return res.status(200).json({success:true, message: "Job posted successfully", job:newjob});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message });
    }
}
export const getCompanyJobApplications = async (req, res) => {

    try{

    }catch(error){}
}

export const getCompanyPostedJobs = async (req, res) => {
    try{
       const companyID = req.company._id;
       const jobs = await Job
       .find({companyID})
       .populate({path:'companyID',select:'-password'});
        //applicants later
         return res.status(200).json({success:true, jobs});

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message });
    }
}

// change job application status
export const changeJobApplicationStatus = async (req, res) => {
    try{

    }catch(error){}
}
// visibility
export const changeJobVisibility = async (req, res) => {
    try{
         const {id} = req.body;
            if(!id){
                return res.status(400).json({success:false, message: "Please provide job id"});
            }
            const companyID = req.company._id;
            const job = await Job.findById(id);
            if(!job){
                return res.status(404).json({success:false, message: "Job not found"});
            }
            if(job.companyID.toString() === companyID.toString()){
                job.visible = !job.visible;
                await job.save();
                return res.status(200).json({success:true, message: "Job visibility changed successfully", job});
            }
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message });
    }
}


