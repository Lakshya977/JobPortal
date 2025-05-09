import express from 'express';
import { applyForJob, getUser, getUserAppliedApplications, updateUserResume } from '../controller/userController.js';
import  upload  from '../config/multer.js'; 

const router = express.Router();

router.get('/user', getUser);

router.post('/apply', applyForJob);

//applied jobs
router.get('/applications',getUserAppliedApplications   );

//updateUserResume  
router.post('/update-resume',upload.single('resume'),updateUserResume)

export default router;