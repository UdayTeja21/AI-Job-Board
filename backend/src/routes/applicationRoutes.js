import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('seeker'), applyForJob);

router.route('/my-applications')
  .get(protect, authorize('seeker'), getMyApplications);

router.route('/job/:jobId')
  .get(protect, authorize('recruiter', 'admin'), getJobApplications);

export default router;
