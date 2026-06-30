import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Briefcase, FileText, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DashboardSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Account Settings</h1>
        <p className="text-text-muted mt-1">Manage your profile details and preferences.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_250px] gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="settings-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text flex items-center gap-2"><User className="h-4 w-4 text-text-muted" /> Full Name</label>
                    <Input defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text flex items-center gap-2"><Mail className="h-4 w-4 text-text-muted" /> Email Address</label>
                    <Input defaultValue={user?.email} disabled />
                  </div>
                </div>

                {user?.role === 'seeker' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><Briefcase className="h-4 w-4 text-text-muted" /> Professional Title</label>
                      <Input placeholder="e.g. Senior Frontend Developer" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">Bio / Summary</label>
                      <textarea 
                        className="w-full min-h-[100px] rounded-lg border border-border bg-surface px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="A short summary about your experience..."
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><FileText className="h-4 w-4 text-text-muted" /> Resume URL</label>
                      <Input placeholder="https://link-to-your-resume.pdf" />
                    </div>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border mt-4 pt-6">
              <Button form="settings-form" type="submit" isLoading={loading}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start text-left">
                <Lock className="h-4 w-4 mr-2" /> Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
