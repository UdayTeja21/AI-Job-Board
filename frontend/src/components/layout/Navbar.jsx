import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="text-xl font-heading font-bold tracking-tight text-text">AI Job Board</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {(!user || user.role !== 'recruiter') && (
            <>
              <Link to="/jobs" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
                Companies
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-muted"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setIsLogoutModalOpen(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-muted hover:text-text focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            {(!user || user.role !== 'recruiter') && (
              <>
                <Link to="/jobs" className="text-base font-medium text-text-muted hover:text-text transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Find Jobs
                </Link>
                <Link to="/companies" className="text-base font-medium text-text-muted hover:text-text transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Companies
                </Link>
              </>
            )}
            
            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-text-muted capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" /> Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={() => {setIsMobileMenuOpen(false); setIsLogoutModalOpen(true);}} className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      <Modal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        title="Confirm Logout"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mb-4">
            <LogOut className="h-6 w-6" />
          </div>
          <p className="text-text">Are you sure you want to log out of your account?</p>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={() => {
                setIsLogoutModalOpen(false);
                logout();
                navigate('/login', { replace: true });
              }}
            >
              Yes, Log Out
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Navbar;
