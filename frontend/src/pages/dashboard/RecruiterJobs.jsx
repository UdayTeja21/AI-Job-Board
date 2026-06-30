import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Briefcase, Plus, MoreVertical, Edit, Trash, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterJobs = () => {
  const [jobs] = useState([
    { _id: '1', title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote', applicants: 12, status: 'Active', date: 'Oct 12, 2023' },
    { _id: '2', title: 'Product Manager', type: 'Full-time', location: 'New York, NY', applicants: 5, status: 'Draft', date: 'Oct 10, 2023' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Manage Jobs</h1>
          <p className="text-text-muted mt-1">Create and manage your job postings.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Post New Job
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50 dark:bg-gray-800/30">
                <th className="px-6 py-4 text-sm font-semibold text-text-muted">Job Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-muted">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-muted">Applicants</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-muted">Posted Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-b border-border hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/jobs/${job._id}`} className="font-semibold text-text hover:text-primary transition-colors block">
                      {job.title}
                    </Link>
                    <div className="text-sm text-text-muted mt-1">{job.type} • {job.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text">
                      <Users className="h-4 w-4 text-text-muted" />
                      {job.applicants}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {job.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-text-muted hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default RecruiterJobs;
