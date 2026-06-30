import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
      maxlength: [100, 'Title can not be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [5000, 'Description can not be more than 5000 characters'],
    },
    requirements: {
      type: [String],
      required: [true, 'Please add requirements'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Software Development',
        'Data Science',
        'Design',
        'Marketing',
        'Sales',
        'Product Management',
        'Other',
      ],
    },
    jobType: {
      type: String,
      required: true,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    },
    workMode: {
      type: String,
      required: true,
      enum: ['Remote', 'Onsite', 'Hybrid'],
    },
    location: {
      type: String,
      required: true,
    },
    salaryRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
