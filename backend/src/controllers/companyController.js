import Company from '../models/Company.js';
import Job from '../models/Job.js';

// @desc    Get all companies with active jobs
// @route   GET /api/companies
// @access  Public
export const getAllCompanies = async (req, res, next) => {
  try {
    const activeJobs = await Job.find({ status: 'Active' }).distinct('company');
    const companies = await Company.find({ _id: { $in: activeJobs } }).select('-recruiter');
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's company profile
// @route   GET /api/companies/my
// @access  Private/Recruiter
export const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });

    if (company) {
      res.json(company);
    } else {
      res.status(404);
      return next(new Error('Company profile not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update company profile
// @route   POST /api/companies/my
// @access  Private/Recruiter
export const updateMyCompany = async (req, res, next) => {
  try {
    const { name, description, website, logo, location, companySize } = req.body;

    let company = await Company.findOne({ recruiter: req.user._id });

    if (company) {
      // Update
      company.name = name || company.name;
      company.description = description || company.description;
      company.website = website !== undefined ? website : company.website;
      company.logo = logo || company.logo;
      company.location = location || company.location;
      if (companySize) company.companySize = companySize;

      const updatedCompany = await company.save();
      return res.json(updatedCompany);
    } else {
      // Create
      company = new Company({
        name,
        description,
        website,
        logo,
        location,
        companySize: companySize || '1-10 employees',
        recruiter: req.user._id,
      });

      const createdCompany = await company.save();
      return res.status(201).json(createdCompany);
    }
  } catch (error) {
    next(error);
  }
};
