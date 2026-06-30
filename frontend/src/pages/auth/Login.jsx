import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
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
              <h3 className="text-xl font-bold text-text">Preparing your dashboard</h3>
              <p className="text-text-muted text-sm">Please wait while we load your personalized experience...</p>
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
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <p className="text-sm text-text-muted">Enter your details to access your account</p>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Email Address</label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-text">Password</label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                  Sign In
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center border-t border-border bg-gray-50/50 dark:bg-gray-800/50 py-4">
              <p className="text-sm text-text-muted">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default Login;
