import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Briefcase, FileText, Settings, Users, Building2, Bell, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const DashboardLayout = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const getNavItems = () => {
    switch (user.role) {
      case 'seeker':
        return [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { name: 'My Applications', href: '/dashboard/applications', icon: FileText },
          { name: 'Saved Jobs', href: '/dashboard/saved', icon: Briefcase },
          { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
          { name: 'Profile Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'recruiter':
        return [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { name: 'ATS Board', href: '/dashboard/ats-board', icon: Users },
          { name: 'Manage Jobs', href: '/dashboard/jobs', icon: Briefcase },
          { name: 'Company Profile', href: '/dashboard/company', icon: Building2 },
          { name: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Users', href: '/dashboard/users', icon: Users },
          { name: 'Jobs', href: '/dashboard/jobs-admin', icon: Briefcase },
          { name: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 max-w-7xl gap-8 relative">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center justify-between mb-4 bg-surface p-4 rounded-2xl shadow-sm border border-border">
        <h2 className="font-heading font-bold text-lg text-text">Dashboard</h2>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-text-muted hover:text-primary transition-colors focus:outline-none bg-[hsl(var(--surface-hover))] rounded-xl"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-64 space-y-6 md:block transition-all duration-300 ease-in-out z-20 shrink-0",
        isMobileSidebarOpen ? "block absolute md:relative top-24 md:top-0 left-4 right-4 md:left-auto md:right-auto bg-surface md:bg-transparent p-6 md:p-0 shadow-2xl md:shadow-none rounded-2xl md:rounded-none border md:border-none border-border" : "hidden"
      )}>
        <div className="p-5 rounded-2xl glass-panel flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-sm border border-primary/20 relative z-10 uppercase">
            {user.name.charAt(0)}
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-text truncate">{user.name}</h3>
            <p className="text-xs text-text-muted capitalize truncate">{user.role}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group',
                  isActive 
                    ? 'text-white shadow-[0_4px_12px_hsl(var(--primary)/0.25)] font-semibold border border-transparent' 
                    : 'text-text-muted hover:bg-[hsl(var(--surface-hover))] hover:text-text border border-transparent'
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-500 opacity-95 -z-10"></div>
                )}
                <item.icon className={cn("h-5 w-5 relative z-10 transition-transform duration-300", isActive ? "text-white" : "group-hover:scale-110")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Overlay for mobile when sidebar is open */}
        {isMobileSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-10" 
            onClick={() => setIsMobileSidebarOpen(false)} 
          />
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
