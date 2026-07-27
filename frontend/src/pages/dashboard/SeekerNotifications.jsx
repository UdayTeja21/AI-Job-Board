import React, { useState, useEffect } from 'react';
import { Bell, CalendarDays, ExternalLink, MessageSquare, Briefcase, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { useSocket } from '../../context/SocketContext';

const SeekerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, setUnreadCount } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      };
      socket.on('new_notification', handleNewNotification);
      return () => {
        socket.off('new_notification', handleNewNotification);
      };
    }
  }, [socket]);

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
      if (setUnreadCount) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
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
    <div className="relative min-h-[80vh]">
      <div className="space-y-4 animate-fade-in max-w-4xl mx-auto pb-12 px-4 sm:px-6 relative z-10 mt-6">
        {/* Standard Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface border border-border/50 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">Notifications</h1>
              <p className="text-text-muted text-sm">Stay updated on your applications and interviews.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-[hsl(var(--surface-hover))] px-3 py-1.5 rounded-lg border border-border/40">
            <span className="flex h-2 w-2 relative">
                {notifications.filter(n => !n.isRead).length > 0 ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_10px_rgba(var(--primary),1)]"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-text-muted/30"></span>
                )}
              </span>
              <span className="font-medium text-text text-sm">
                {notifications.filter(n => !n.isRead).length} Unread
              </span>
            </div>
        </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-[hsl(var(--surface-hover)/0.3)] animate-pulse rounded-xl border border-border/40"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 px-4 bg-surface rounded-xl border border-border/40 flex flex-col items-center justify-center shadow-sm">
          <Bell className="w-12 h-12 text-text-muted/40 mb-4" />
          <h3 className="text-lg font-bold text-text mb-1">You're all caught up!</h3>
          <p className="text-text-muted text-sm">You have no new notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`group relative overflow-hidden p-4 sm:p-5 rounded-xl border transition-colors ${
                !notification.isRead 
                  ? 'bg-surface border-primary/30 shadow-sm' 
                  : 'bg-[hsl(var(--surface-hover)/0.4)] border-border/40 opacity-90'
              }`}
            >
              {/* Left Accent Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                !notification.isRead 
                  ? (notification.type === 'interview_scheduled' ? 'bg-indigo-500' : 'bg-blue-500')
                  : 'bg-transparent'
              }`}></div>

              <div className="flex flex-col sm:flex-row gap-4 items-start pl-3 relative z-10">
                <div className={`shrink-0 p-3 rounded-lg h-fit ${
                  notification.type === 'interview_scheduled' 
                    ? (!notification.isRead ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-surface border border-indigo-100/50 text-indigo-400') 
                    : (!notification.isRead ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-surface border border-blue-100/50 text-blue-400')
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1.5">
                    <h3 className={`text-sm sm:text-base font-bold ${!notification.isRead ? 'text-text' : 'text-text-muted'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted bg-[hsl(var(--surface-hover))] px-2 py-0.5 rounded border border-border/40">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      {!notification.isRead && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm leading-relaxed mb-2 ${!notification.isRead ? 'text-text/90' : 'text-text-muted'}`}>
                    {notification.message}
                  </p>
                  
                  {/* Interview Specific Details */}
                  {notification.type === 'interview_scheduled' && notification.data && (
                    <div className="bg-[hsl(var(--surface-hover)/0.5)] rounded-lg p-4 border border-indigo-500/10 space-y-4 mt-3">
                      {notification.data.availableSlots && (
                        <div>
                          <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4" /> Proposed Time Slots
                          </h4>
                          <div className="text-sm text-text bg-surface px-3 py-2 rounded border border-indigo-500/10 whitespace-pre-wrap">
                            {notification.data.availableSlots}
                          </div>
                        </div>
                      )}
                      
                      {notification.data.meetingLink && (
                        <div>
                          <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
                            <ExternalLink className="w-4 h-4" /> Meeting Details
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <input 
                              type="text" 
                              readOnly 
                              value={notification.data.meetingLink}
                              className="w-full sm:flex-1 bg-surface border border-indigo-500/20 rounded px-3 py-1.5 text-sm text-text focus:outline-none"
                            />
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-4 rounded text-sm h-auto" asChild>
                              <a href={notification.data.meetingLink} target="_blank" rel="noopener noreferrer">
                                Join Meeting
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!notification.isRead && (
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" onClick={() => markAsRead(notification._id)} className="border-border/50 hover:bg-primary hover:text-primary-foreground rounded py-1 px-3 text-xs h-auto shadow-none">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark read
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
    </div>
  );
};

export default SeekerNotifications;
