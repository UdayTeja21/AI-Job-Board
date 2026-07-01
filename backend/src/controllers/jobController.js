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
    const jobType = req.query.jobType ? { jobType: req.query.jobType } : {};
    
    // For location, we can do a simple regex match
    const location = req.query.location 
      ? { location: { $regex: req.query.location, $options: 'i' } } 
      : {};
    
    const query = { ...keyword, ...category, ...workMode, ...jobType, ...location, status: 'Active' };

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

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/recruiter
// @access  Private/Recruiter
export const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this job'));
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
      status,
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) job.requirements = typeof requirements === 'string' ? requirements.split(',').map((r) => r.trim()) : requirements;
    if (category) job.category = category;
    if (jobType) job.jobType = jobType;
    if (workMode) job.workMode = workMode;
    if (location) job.location = location;
    if (salaryRange) job.salaryRange = salaryRange;
    if (status) job.status = status;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this job'));
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    next(error);
  }
};
