import express from 'express';
import { getMyCompany, updateMyCompany, getAllCompanies } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllCompanies);

router.route('/my')
  .get(protect, authorize('recruiter'), getMyCompany)
  .post(protect, authorize('recruiter'), updateMyCompany);

export default router;
