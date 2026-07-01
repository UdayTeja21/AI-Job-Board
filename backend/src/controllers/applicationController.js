import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

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

// @desc    Get all applications for jobs posted by a recruiter
// @route   GET /api/applications/recruiter
// @access  Private/Recruiter
export const getRecruiterApplications = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).select('_id');
    const jobIds = jobs.map(j => j._id);
    
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email avatar skills title')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Accepted'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      return next(new Error('Invalid status'));
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    // Ensure the recruiter updating the application owns the job
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this application'));
    }

    application.status = status;
    const updatedApplication = await application.save();

    // Create Notification for the Seeker
    const { availableSlots, meetingLink, message } = req.body;
    let notifType = 'application_update';
    let title = `Application Update: ${application.job.title}`;
    let notifMessage = `Your application status has been updated to ${status}.`;

    if (status === 'Interview') {
      notifType = 'interview_scheduled';
      title = `Interview Request: ${application.job.title}`;
      notifMessage = message || `The recruiter would like to schedule an interview with you!`;
    } else if (status === 'Accepted') {
      title = `Offer Extended: ${application.job.title}`;
      notifMessage = `Congratulations! The recruiter has extended an offer.`;
    }

    await Notification.create({
      recipient: application.applicant,
      sender: req.user._id,
      type: notifType,
      title,
      message: notifMessage,
      data: {
        applicationId: application._id,
        jobId: application.job._id,
        availableSlots: availableSlots || '',
        meetingLink: meetingLink || '',
      }
    });

    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};
