import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter', 'admin'), createJob);

router.route('/:id').get(getJobById);

export default router;
