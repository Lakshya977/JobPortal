import express from 'express';
import { changeJobApplicationStatus, changeJobVisibility, getCompanyData, getCompanyJobApplications, getCompanyPostedJobs, loginCompany, postjob, registerCompany } from '../controller/companycontroller.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register',upload.single('image'), registerCompany)  

router.post('/login',loginCompany)

router.get('/company',protectCompany,getCompanyData)

router.post('/postjob',protectCompany,postjob)

router.get('/applicants',protectCompany,getCompanyJobApplications)

router.get('/list-jobs',protectCompany,getCompanyPostedJobs)

router.post('/change-status',protectCompany,changeJobApplicationStatus)

router.post('/change-visibility',protectCompany,changeJobVisibility)

export default router;