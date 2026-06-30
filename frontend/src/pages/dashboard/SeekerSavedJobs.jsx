import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Bookmark } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const SeekerSavedJobs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Saved Jobs</h1>
        <p className="text-text-muted mt-1">Jobs you've bookmarked to apply later.</p>
      </div>

      <Card className="text-center py-16 bg-surface/50 border-dashed">
        <CardContent>
          <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-medium text-text mb-2">No saved jobs yet</h3>
          <p className="text-text-muted mb-6">When you see a job you like, bookmark it to view it here.</p>
          <Link to="/jobs">
            <Button>Explore Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekerSavedJobs;
