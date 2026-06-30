import Job from '../models/Job.js';
import Company from '../models/Company.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    // Filtering
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const workMode = req.query.workMode ? { workMode: req.query.workMode } : {};
    
    const query = { ...keyword, ...category, ...workMode, status: 'Active' };

    const count = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ jobs, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    
    if (job) {
      res.json(job);
    } else {
      res.status(404);
      return next(new Error('Job not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
export const createJob = async (req, res, next) => {
  try {
    // Check if user has a company
    const company = await Company.findOne({ recruiter: req.user._id });
    
    if (!company) {
      res.status(400);
      return next(new Error('You must create a company profile first before posting jobs'));
    }

    const {
      title,
      description,
      requirements,
      category,
      jobType,
      workMode,
      location,
      salaryRange,
    } = req.body;

    const job = new Job({
      title,
      description,
      requirements: requirements.split(',').map((req) => req.trim()),
      category,
      jobType,
      workMode,
      location,
      salaryRange,
      company: company._id,
      recruiter: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    next(error);
  }
};
