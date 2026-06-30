import { aiMockResponses } from '../utils/aiMockResponses.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Get AI Job Summary
// @route   POST /api/ai/job-summary
// @access  Public
export const getJobSummary = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    
    // In a real app, this would call OpenAI/Gemini with the job description
    // For this assessment, we return a realistic mocked response
    
    // Simulate API delay
    setTimeout(() => {
      res.json(aiMockResponses.jobSummary);
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
      // Save the mock score to the application
      application.aiMatchScore = aiMockResponses.resumeMatch.score;
      application.aiAnalysis = aiMockResponses.resumeMatch.analysis;
      await application.save();

      res.json(aiMockResponses.resumeMatch);
    }, 2000);
  } catch (error) {
    next(error);
  }
};
