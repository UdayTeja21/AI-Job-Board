import { aiMockResponses } from '../utils/aiMockResponses.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Get AI Job Summary
// @route   POST /api/ai/job-summary
// @access  Public
export const getJobSummary = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    
    let jobTitle = "position";
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        jobTitle = job.title;
      }
    }
    
    // Simulate API delay
    setTimeout(() => {
      res.json({
        summary: `This is a highly sought-after ${jobTitle} role. The ideal candidate will be deeply familiar with the core requirements of this position, demonstrating strong technical leadership and problem-solving skills. This role offers excellent growth opportunities, competitive compensation, and the chance to make a significant impact on our core product.`
      });
    }, 1500);
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Resume Match Score
// @route   POST /api/ai/match-score
// @access  Private/Recruiter
export const getResumeMatchScore = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    
    const application = await Application.findById(applicationId).populate('job').populate('applicant');
    
    if (!application) {
      res.status(404);
      return next(new Error('Application not found'));
    }

    // Simulate AI processing delay
    setTimeout(async () => {
      const applicantName = application.applicant?.name || 'The candidate';
      const applicantTitle = application.applicant?.title || 'Professional';
      const jobTitle = application.job?.title || 'this role';
      
      // Generate a consistent pseudo-random score based on the application ID length/characters
      const baseScore = 65;
      const randomFactor = Array.from(String(application._id)).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 30;
      const score = baseScore + randomFactor;
      
      let matchQuality = "an average";
      if (score > 85) matchQuality = "an exceptional";
      else if (score > 75) matchQuality = "a strong";
      
      const analysis = `${applicantName}'s experience as a ${applicantTitle} makes them ${matchQuality} fit for the ${jobTitle} position. Their background aligns well with the core responsibilities of the role. ${score > 80 ? 'They have the exact technical expertise we are looking for.' : 'They may require a short ramp-up period to fully align with our specific requirements, but demonstrate high potential.'}`;

      const dynamicResponse = {
        score,
        analysis,
        skillsMatched: application.job?.tags || [],
        skillsMissing: []
      };

      // Save the dynamic score to the application
      application.aiMatchScore = score;
      application.aiAnalysis = analysis;
      await application.save();

      res.json(dynamicResponse);
    }, 2000);
  } catch (error) {
    next(error);
  }
};
