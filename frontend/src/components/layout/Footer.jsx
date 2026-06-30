import React from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">AI Job Board</span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs">
              The premium, AI-powered platform connecting top talent with world-class companies.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-text-muted hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors">LinkedIn</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Candidates</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-primary transition-colors">Browse Companies</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Candidate Dashboard</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Advice</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Employers</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Recruiter Dashboard</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} AI Job Board. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Built with React, Node.js & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
