import express from 'express';
import { requireAuth } from '@clerk/express'; // Import requireAuth
import { applyForJob, getUser, getUserAppliedApplications, updateUserResume } from '../controller/userController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/user', requireAuth(), getUser); // Protect the route
router.post('/apply', applyForJob);
router.get('/applications', getUserAppliedApplications);
router.post('/update-resume', upload.single('resume'), updateUserResume);

export default router;