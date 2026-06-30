import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Briefcase, FileText, Settings, Users, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const DashboardLayout = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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
          { name: 'Profile Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'recruiter':
        return [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
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
    <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 max-w-7xl gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        <div className="p-4 mb-4 rounded-xl bg-surface border border-border flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary font-bold text-xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-text">{user.name}</h3>
            <p className="text-sm text-text-muted capitalize">{user.role}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-text-muted hover:bg-surface hover:text-text'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
