import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, FileText, Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Modal from '../../components/ui/Modal';

const DashboardSettings = () => {
  const { user, login, logout } = useAuth(); // Need to update auth context if profile changes
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    skills: '',
    resume: ''
  });

  const [pwdData, setPwdData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        resume: user.resume || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePwdChange = (e) => {
    setPwdData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', formData);
      // Update local storage and context if necessary
      // login() function in context usually just takes the res.data and sets user
      if (res.data.token) {
         localStorage.setItem('token', res.data.token);
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdData.password !== pwdData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setPwdLoading(true);
    try {
      await api.put('/auth/profile', { password: pwdData.password });
      setPwdData({ password: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete('/auth/profile');
      setIsDeleteModalOpen(false);
      logout();
      navigate('/login', { replace: true });
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Account Settings</h1>
        <p className="text-text-muted mt-1">Manage your profile details and preferences.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="settings-form" onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text flex items-center gap-2"><User className="h-4 w-4 text-text-muted" /> Full Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text flex items-center gap-2"><Mail className="h-4 w-4 text-text-muted" /> Email Address</label>
                    <Input value={user?.email || ''} disabled />
                  </div>
                </div>

                {user?.role === 'seeker' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><Briefcase className="h-4 w-4 text-text-muted" /> Professional Title</label>
                      <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">Bio / Summary</label>
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full min-h-[100px] rounded-lg border border-border bg-surface px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="A short summary about your experience..."
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><FileText className="h-4 w-4 text-text-muted" /> Skills (comma separated)</label>
                      <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, CSS" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><FileText className="h-4 w-4 text-text-muted" /> Resume URL</label>
                      <Input name="resume" value={formData.resume} onChange={handleChange} placeholder="https://link-to-your-resume.pdf" />
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
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">New Password</label>
                  <Input type="password" name="password" value={pwdData.password} onChange={handlePwdChange} required placeholder="••••••••" minLength="6" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Confirm Password</label>
                  <Input type="password" name="confirmPassword" value={pwdData.confirmPassword} onChange={handlePwdChange} required placeholder="••••••••" minLength="6" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border mt-4 pt-6">
              <Button form="password-form" type="submit" isLoading={pwdLoading} className="w-full">Update Password</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Account"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <p className="text-text font-medium text-lg">Are you absolutely sure you want to delete your account?</p>
          <p className="text-text-muted text-sm px-4">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
          <div className="flex gap-3 justify-center pt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={handleDeleteAccount}
              isLoading={deleteLoading}
            >
              Yes, Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardSettings;
