import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, FileText, Lock, AlertTriangle, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Modal from '../../components/ui/Modal';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto pb-12"
    >
      <div className="flex items-center gap-4 p-8 rounded-3xl glass-card relative overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-sm shrink-0">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text">Account Settings</h1>
          <p className="text-text-muted mt-2 text-lg">Manage your profile details and preferences.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">
          <Card className="shadow-premium border-border/60 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
            <CardHeader className="bg-[hsl(var(--surface-hover)/0.5)] border-b border-border/60 pb-6">
              <CardTitle className="text-xl font-heading">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <form id="settings-form" onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text flex items-center gap-2"><User className="h-4 w-4 text-text-muted" /> Full Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required className="bg-background shadow-sm border-border/60 h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text flex items-center gap-2"><Mail className="h-4 w-4 text-text-muted" /> Email Address</label>
                    <Input value={user?.email || ''} disabled className="bg-[hsl(var(--surface-hover))] border-border/40 opacity-70 cursor-not-allowed h-12" />
                  </div>
                </div>

                {user?.role === 'seeker' && (
                  <>
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><Briefcase className="h-4 w-4 text-text-muted" /> Professional Title</label>
                      <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" className="bg-background shadow-sm border-border/60 h-12" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-medium text-text">Bio / Summary</label>
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full min-h-[120px] rounded-xl border border-border/60 bg-background px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm resize-y placeholder:text-text-muted/50"
                        placeholder="A short summary about your experience..."
                      ></textarea>
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><FileText className="h-4 w-4 text-text-muted" /> Skills (comma separated)</label>
                      <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, CSS" className="bg-background shadow-sm border-border/60 h-12" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="text-sm font-medium text-text flex items-center gap-2"><FileText className="h-4 w-4 text-text-muted" /> Resume URL</label>
                      <Input name="resume" value={formData.resume} onChange={handleChange} placeholder="https://link-to-your-resume.pdf" className="bg-background shadow-sm border-border/60 h-12" />
                    </div>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/60 mt-4 py-6 bg-[hsl(var(--surface-hover)/0.3)]">
              <Button form="settings-form" type="submit" isLoading={loading} className="px-8 shadow-premium h-11">Save Changes</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="border-b border-border/60 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg font-heading"><Lock className="h-5 w-5 text-primary" /> Change Password</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">New Password</label>
                  <Input type="password" name="password" value={pwdData.password} onChange={handlePwdChange} required placeholder="••••••••" minLength="6" className="bg-background shadow-sm h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Confirm Password</label>
                  <Input type="password" name="confirmPassword" value={pwdData.confirmPassword} onChange={handlePwdChange} required placeholder="••••••••" minLength="6" className="bg-background shadow-sm h-11" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/60 py-5">
              <Button form="password-form" type="submit" isLoading={pwdLoading} className="w-full h-11">Update Password</Button>
            </CardFooter>
          </Card>

          <Card className="border-red-200/50 dark:border-red-900/30 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-red-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-red-600 flex items-center gap-2 text-lg font-heading"><AlertTriangle className="w-5 h-5" /> Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="text-sm text-text-muted mb-5 leading-relaxed">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20 h-11 shadow-sm font-semibold transition-all"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Account"
      >
        <div className="space-y-5 text-center px-4 py-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mb-6 border border-red-200 dark:border-red-800">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text">Are you absolutely sure?</h3>
          <p className="text-text-muted text-sm leading-relaxed">This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8 border-t border-border/60 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="sm:flex-1 h-11">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 sm:flex-1 h-11 shadow-md shadow-red-600/20"
              onClick={handleDeleteAccount}
              isLoading={deleteLoading}
            >
              Yes, Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default DashboardSettings;
