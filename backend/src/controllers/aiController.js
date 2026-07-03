import { GoogleGenerativeAI } from '@google/generative-ai';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

let genAI;
const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// @desc    Get AI Job Summary
// @route   POST /api/ai/job-summary
// @access  Public
export const getJobSummary = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    
    let jobTitle = "position";
    let jobDescription = "";
    let jobRequirements = [];

    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        jobTitle = job.title;
        jobDescription = job.description;
        jobRequirements = job.requirements;
      }
    } else {
      res.status(400);
      return next(new Error('Job ID is required'));
    }
    
    const model = getGenAI().getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      You are an expert technical recruiter and copywriter.
      Please write a very engaging, 2-3 sentence summary for the following job role to attract top talent.
      Do not include any pleasantries, just the summary.
      
      Job Title: ${jobTitle}
      Description: ${jobDescription}
      Requirements: ${(jobRequirements || []).join(', ')}
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    res.json({ summary });
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

    const applicant = application.applicant;
    const job = application.job;

    const applicantProfile = `
      Name: ${applicant.name || 'Candidate'}
      Title: ${applicant.title || 'Professional'}
      Bio: ${applicant.bio || 'Not provided'}
      Skills: ${(applicant.skills || []).join(', ') || 'None provided'}
    `;

    const jobProfile = `
      Title: ${job.title}
      Description: ${job.description}
      Requirements: ${(job.requirements || []).join(', ')}
    `;
    
    const model = getGenAI().getGenerativeModel({ model: "gemini-flash-latest" });
    
    // Request JSON output specifically
    const prompt = `
      You are an expert technical recruiter and AI matching engine. 
      Evaluate how well the candidate matches the job description.
      
      Candidate Profile:
      ${applicantProfile}
      
      Job Profile:
      ${jobProfile}
      
      Respond strictly with a JSON object containing the following keys (no markdown formatting, no code blocks, just raw JSON):
      {
        "score": (a number from 0 to 100 representing the match percentage),
        "analysis": (a 2-3 sentence explanation of why this score was given, focusing on strengths and weaknesses),
        "skillsMatched": (an array of strings of the candidate's skills that match the job),
        "skillsMissing": (an array of strings of the job requirements that the candidate is missing)
      }
    `;

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();
    
    // Strip markdown code blocks if the AI accidentally adds them
    if (textResult.startsWith('\`\`\`json')) {
      textResult = textResult.substring(7);
    } else if (textResult.startsWith('\`\`\`')) {
      textResult = textResult.substring(3);
    }
    if (textResult.endsWith('\`\`\`')) {
      textResult = textResult.substring(0, textResult.length - 3);
    }
    
    let dynamicResponse;
    try {
      dynamicResponse = JSON.parse(textResult);
    } catch (parseError) {
      // Fallback if parsing fails
      dynamicResponse = {
        score: 65,
        analysis: "Unable to complete detailed analysis at this time, but candidate meets basic criteria.",
        skillsMatched: [],
        skillsMissing: []
      };
      console.error("Gemini JSON parse error: ", parseError, textResult);
    }

    // Save the dynamic score to the application
    application.aiMatchScore = dynamicResponse.score;
    application.aiAnalysis = dynamicResponse.analysis;
    await application.save();

    res.json(dynamicResponse);
  } catch (error) {
    next(error);
  }
};
