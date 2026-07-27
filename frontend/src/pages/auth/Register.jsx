import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

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

  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      await googleLogin(credentialResponse.credential, formData.role);
      toast.success('Account created successfully');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google Sign-up failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse-slow"></div>
      
      <Card className="w-full max-w-md relative z-10 glass-panel border-border/60">
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin relative z-10"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-heading font-bold text-text">Setting up your workspace</h3>
              <p className="text-text-muted text-sm">Please wait while we initialize your profile...</p>
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="text-center space-y-2 border-b-0 pb-0 pt-8">
              <div className="flex justify-center mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 shadow-glow">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
              <p className="text-sm text-text-muted">Join the premium AI job board today</p>
            </CardHeader>
            
            <CardContent className="pt-8">

              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Sign-up failed')}
                  theme="filled_blue"
                  shape="rectangular"
                  width="100%"
                  text="signup_with"
                />
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-muted">Or continue with email</span>
                </div>
              </div>


              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text">I am a</label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-[hsl(var(--surface-hover))] rounded-xl border border-border/50">
                    <button
                      type="button"
                      className={cn(
                        "py-2 text-sm font-medium rounded-lg transition-all",
                        formData.role === 'seeker' ? "bg-surface text-text shadow-sm border border-border/50" : "text-text-muted hover:text-text"
                      )}
                      onClick={() => setFormData({ ...formData, role: 'seeker' })}
                    >
                      Job Seeker
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "py-2 text-sm font-medium rounded-lg transition-all",
                        formData.role === 'recruiter' ? "bg-surface text-text shadow-sm border border-border/50" : "text-text-muted hover:text-text"
                      )}
                      onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                    >
                      Recruiter
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text">Full Name</label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text">Email Address</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text">Password</label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-2 py-5" isLoading={isLoading}>
                  Create Account
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center border-t border-border bg-[hsl(var(--surface-hover)/0.3)] py-5">
              <p className="text-sm text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
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
