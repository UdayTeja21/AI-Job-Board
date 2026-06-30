import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Building2, Globe, MapPin, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RecruiterCompany = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Company profile updated successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Company Profile</h1>
        <p className="text-text-muted mt-1">Manage your organization's public profile.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="company-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-border">
              <div className="h-24 w-24 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-border flex items-center justify-center text-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs font-medium">Upload Logo</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-text">Company Logo</h3>
                <p className="text-sm text-text-muted">Recommended size: 400x400px.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Company Name</label>
                <Input placeholder="Tech Innovators Inc." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><Globe className="h-4 w-4 text-text-muted" /> Website</label>
                <Input placeholder="https://example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><Users className="h-4 w-4 text-text-muted" /> Company Size</label>
                <select className="w-full h-11 px-4 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><MapPin className="h-4 w-4 text-text-muted" /> Headquarters</label>
                <Input placeholder="San Francisco, CA" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Company Description</label>
              <textarea 
                className="w-full min-h-[120px] rounded-lg border border-border bg-surface px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Tell candidates what your company is all about..."
              ></textarea>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border mt-4 pt-6">
          <Button form="company-form" type="submit" isLoading={loading}>Save Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecruiterCompany;
