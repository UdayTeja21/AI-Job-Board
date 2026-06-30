import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: String,
      required: [true, 'Please provide a resume'],
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Accepted'],
      default: 'Applied',
    },
    aiMatchScore: {
      type: Number, // Percentage 0-100
      default: null,
    },
    aiAnalysis: {
      type: String, // AI-generated text analyzing fit
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from applying to the same job multiple times
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
