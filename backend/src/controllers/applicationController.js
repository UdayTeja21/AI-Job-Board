import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Seeker
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // Check if user already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      res.status(400);
      return next(new Error('You have already applied for this job'));
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume,
      coverLetter,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get seeker's applications
// @route   GET /api/applications/my-applications
// @access  Private/Seeker
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get job applications (for recruiters)
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
export const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      res.status(404);
      return next(new Error('Job not found'));
    }

    // Ensure the recruiter owns the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to view these applications'));
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email avatar skills title')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};
