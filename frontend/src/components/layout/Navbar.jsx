import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Briefcase, User, LogOut, Menu, X, Search, Bell } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket() || { unreadCount: 0 };
  const { theme, toggleTheme } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary relative py-1",
          isActive ? "text-primary font-semibold" : "text-text-muted"
        )}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in"></span>
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(var(--surface)/0.8)] backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-text">AI Job Board</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {(!user || user.role !== 'recruiter') && (
            <>
              <NavLink to="/jobs">Find Jobs</NavLink>
              <NavLink to="/companies">Companies</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-[hsl(var(--surface-hover))] transition-colors text-text-muted hidden sm:block">
            <Search className="h-5 w-5" />
          </button>
          {user && (
            <button 
              className="p-2 rounded-full hover:bg-[hsl(var(--surface-hover))] transition-colors text-text-muted relative"
              onClick={() => navigate('/dashboard/notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 min-w-[16px] px-1 bg-primary rounded-full border-2 border-surface flex items-center justify-center text-[10px] text-white font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[hsl(var(--surface-hover))] transition-colors text-text-muted"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-border hidden md:flex">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setIsLogoutModalOpen(true)} className="text-danger hover:bg-danger/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-border hidden md:flex">
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
