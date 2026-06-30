import express from 'express';
import {
  getJobSummary,
  getResumeMatchScore,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/job-summary', getJobSummary);
router.post('/match-score', protect, authorize('recruiter', 'admin'), getResumeMatchScore);

export default router;
