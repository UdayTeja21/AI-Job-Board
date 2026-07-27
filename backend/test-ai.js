import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `
      You are an expert technical recruiter and AI matching engine. 
      Evaluate how well the candidate matches the job description.
      
      Candidate Profile:
      Name: John Doe
      Title: Software Engineer
      Bio: 5 years of experience in React and Node.js
      Skills: React, Node.js, MongoDB
      
      Job Profile:
      Title: Full Stack Developer
      Description: Looking for a developer with React and Node.js experience.
      Requirements: React, Node.js
      
      Respond strictly with a JSON object containing the following keys (no markdown formatting, no code blocks, just raw JSON):
      {
        "score": (a number from 0 to 100 representing the match percentage),
        "analysis": (a 2-3 sentence explanation of why this score was given, focusing on strengths and weaknesses),
        "skillsMatched": (an array of strings of the candidate's skills that match the job),
        "skillsMissing": (an array of strings of the job requirements that the candidate is missing)
      }
    `;
    const result = await model.generateContent(prompt);
    console.log('RAW RESPONSE:');
    console.log(result.response.text());
  } catch(e) {
    console.error('ERROR:', e.message);
  }
}
test();
