import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getRecruiterApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('seeker'), applyForJob);

router.route('/my-applications')
  .get(protect, authorize('seeker'), getMyApplications);

router.route('/recruiter')
  .get(protect, authorize('recruiter'), getRecruiterApplications);

router.route('/job/:jobId')
  .get(protect, authorize('recruiter', 'admin'), getJobApplications);

router.route('/:id/status')
  .put(protect, authorize('recruiter', 'admin'), updateApplicationStatus);

export default router;
