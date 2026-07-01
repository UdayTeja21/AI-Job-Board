import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    
    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md">
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin relative z-10"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text">Setting up your workspace</h3>
              <p className="text-text-muted text-sm">Please wait while we initialize your profile...</p>
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="text-center space-y-2 border-b-0 pb-0 pt-8">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <p className="text-sm text-text-muted">Join the premium AI job board today</p>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">I am a</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={formData.role === 'seeker' ? 'primary' : 'secondary'}
                      onClick={() => setFormData({ ...formData, role: 'seeker' })}
                    >
                      Job Seeker
                    </Button>
                    <Button
                      type="button"
                      variant={formData.role === 'recruiter' ? 'primary' : 'secondary'}
                      onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                    >
                      Recruiter
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Full Name</label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Password</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                  Create Account
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center border-t border-border bg-gray-50/50 dark:bg-gray-800/50 py-4">
              <p className="text-sm text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default Register;
