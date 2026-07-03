import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';
import { baseEmailTemplate } from '../utils/emailTemplates.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Seeker
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const job = await Job.findById(jobId)
      .populate('company')
      .populate('recruiter', 'name email');
      
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

    // Send "Applied" confirmation email to Seeker
    try {
      sendEmail({
        email: req.user.email,
        subject: `Application Received: ${job.title}`,
        html: baseEmailTemplate(`Application Received: ${job.title}`, `
          <h2>Application Successfully Submitted!</h2>
          <p>Hi ${req.user.name},</p>
          <p>Your application for the <strong>${job.title}</strong> position at ${job.company?.name || 'our company'} has been successfully received.</p>
          <p>The recruitment team will review your application and you will be notified of any status updates.</p>
          <br>
          <p>Best of luck,<br>The Recruitment Team</p>
        `)
      });
    } catch (emailErr) {
      console.error('Failed to send applied email to candidate', emailErr);
    }

    // Send "New Application" notification email to Recruiter
    if (job.recruiter && job.recruiter.email) {
      try {
        sendEmail({
          email: job.recruiter.email,
          subject: `New Application Received: ${job.title}`,
          html: baseEmailTemplate(`New Application Received: ${job.title}`, `
            <h2>New Candidate Application</h2>
            <p>Hi ${job.recruiter.name},</p>
            <p>You have received a new application for the <strong>${job.title}</strong> position.</p>
            <div class="info-box">
              <p><strong>Candidate Name:</strong> ${req.user.name}</p>
              <p><strong>Candidate Email:</strong> ${req.user.email}</p>
            </div>
            <p>Please log in to your Recruiter Dashboard to review their resume and full profile.</p>
            <br>
            <p>Best regards,<br>AI Job Board System</p>
          `)
        });
      } catch (recruiterEmailErr) {
        console.error('Failed to send notification email to recruiter', recruiterEmailErr);
      }
    }

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
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          model: 'Company'
        }
      })
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

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email');
      
    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    // Ensure the recruiter updating the application owns the job
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this application'));
    }

    const { availableSlots, meetingLink, message } = req.body;
    
    application.status = status;
    if (status === 'Interview') {
      application.interviewDetails = { availableSlots, meetingLink, message };
    }
    const updatedApplication = await application.save();

    // Create Notification for the Seeker
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

    // Send automated email for ALL status updates
    try {
      let emailHtml = '';
      if (status === 'Interview') {
        emailHtml = baseEmailTemplate(title, `
          <h2>Interview Invitation: ${application.job.title}</h2>
          <p>Hi ${application.applicant.name},</p>
          <p>Great news! The team at ${application.job.company?.name || 'our company'} would like to invite you for an interview for the <strong>${application.job.title}</strong> position.</p>
          
          <div class="info-box">
            <h3>Proposed Time Slots:</h3>
            <p style="white-space: pre-wrap;">${availableSlots || 'Please reply to this email to coordinate a time.'}</p>
            
            ${meetingLink ? `
              <h3 style="margin-top: 15px;">Meeting Link:</h3>
              <a href="${meetingLink}" class="btn">Join Interview</a>
              <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">Or copy this link: ${meetingLink}</p>
            ` : ''}
          </div>

          ${message ? `
            <h3>Message from Recruiter:</h3>
            <blockquote style="border-left: 4px solid #4f46e5; padding-left: 15px; color: #4b5563; font-style: italic;">
              ${message}
            </blockquote>
          ` : ''}
          <br>
          <p>Best regards,<br>The Recruitment Team</p>
        `);
      } else if (status === 'Accepted') {
        emailHtml = baseEmailTemplate(title, `
          <h2>Congratulations! 🎉</h2>
          <p>Hi ${application.applicant.name},</p>
          <p>We are thrilled to inform you that you have been selected for the <strong>${application.job.title}</strong> position!</p>
          <p>The recruitment team will be in touch shortly with the next steps and your official offer letter.</p>
          <p>Welcome to the team!</p>
          <br>
          <p>Best regards,<br>The Recruitment Team</p>
        `);
      } else if (status === 'Reviewing' || status === 'Shortlisted') {
        emailHtml = baseEmailTemplate(title, `
          <h2>Application Update: ${application.job.title}</h2>
          <p>Hi ${application.applicant.name},</p>
          <p>Congratulations, you are moved to the Screening Round for the <strong>${application.job.title}</strong> position.</p>
          <p>We are currently evaluating your profile and will update you on the next steps soon.</p>
          <br>
          <p>Best regards,<br>The Recruitment Team</p>
        `);
      } else if (status === 'Rejected') {
        emailHtml = baseEmailTemplate(title, `
          <h2>Application Update: ${application.job.title}</h2>
          <p>Hi ${application.applicant.name},</p>
          <p>Thank you for taking the time to apply for the <strong>${application.job.title}</strong> position.</p>
          <p>After careful consideration, we have decided to move forward with other candidates who more closely match our current needs for this role.</p>
          <p>We appreciate your interest in our company and wish you the best of luck in your job search.</p>
          <br>
          <p>Best regards,<br>The Recruitment Team</p>
        `);
      }

      if (emailHtml) {
        sendEmail({
          email: application.applicant.email,
          subject: title,
          html: emailHtml
        });
      }
    } catch (emailError) {
      console.error('Failed to trigger email notification', emailError);
    }

    res.json(updatedApplication);
  } catch (error) {
    next(error);
  }
};
