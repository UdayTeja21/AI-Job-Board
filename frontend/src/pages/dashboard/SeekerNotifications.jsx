import React, { useState, useEffect } from 'react';
import { Bell, CalendarDays, ExternalLink, MessageSquare, Briefcase, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const SeekerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'interview_scheduled':
        return <CalendarDays className="w-6 h-6 text-indigo-500" />;
      case 'application_update':
        return <Briefcase className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[hsl(var(--surface-hover)/0.5)] p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text">Notifications</h1>
            <p className="text-text-muted mt-1 text-sm">Updates on your applications and interviews.</p>
          </div>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-[hsl(var(--surface))] rounded-lg border border-border/50">
          {notifications.filter(n => !n.isRead).length} unread
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-[hsl(var(--surface-hover)/0.3)] animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-[hsl(var(--surface)/0.6)] rounded-3xl border border-border/50 border-dashed max-w-lg mx-auto">
          <Bell className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
          <h3 className="text-xl font-medium">You're all caught up!</h3>
          <p className="text-text-muted text-sm mt-1 mb-6">You have no new notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                !notification.isRead 
                  ? 'bg-[hsl(var(--surface))] border-primary/30 shadow-md shadow-primary/5' 
                  : 'bg-[hsl(var(--surface-hover)/0.3)] border-border/50 shadow-sm opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex gap-4 sm:gap-6">
                <div className={`shrink-0 p-3 rounded-xl h-fit ${
                  notification.type === 'interview_scheduled' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className={`text-lg font-heading font-bold ${!notification.isRead ? 'text-text' : 'text-text-muted'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-text-muted whitespace-nowrap bg-[hsl(var(--surface-hover))] px-2 py-1 rounded">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-text-muted leading-relaxed mb-4">
                    {notification.message}
                  </p>
                  
                  {/* Interview Specific Details */}
                  {notification.type === 'interview_scheduled' && notification.data && (
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/30 space-y-4 mt-2">
                      {notification.data.availableSlots && (
                        <div>
                          <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-2">Proposed Time Slots</h4>
                          <div className="text-sm font-medium text-text bg-white dark:bg-slate-900 px-4 py-3 rounded-lg border border-indigo-100 dark:border-indigo-800/50 whitespace-pre-wrap">
                            {notification.data.availableSlots}
                          </div>
                        </div>
                      )}
                      
                      {notification.data.meetingLink && (
                        <div>
                          <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-2">Meeting Details</h4>
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <input 
                              type="text" 
                              readOnly 
                              value={notification.data.meetingLink}
                              className="flex-1 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-800/50 rounded-lg px-3 py-2 text-sm text-text-muted w-full"
                            />
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" asChild>
                              <a href={notification.data.meetingLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" /> Connect Now
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!notification.isRead && (
                    <div className="mt-4 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification._id)} className="text-text-muted hover:text-primary">
                        <CheckCircle className="w-4 h-4 mr-2" /> Mark as read
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerNotifications;
