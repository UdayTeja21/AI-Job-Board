import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Fetch initial notifications to get unread count
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const { data } = await api.get('/notifications');
          const unread = data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error('Failed to fetch notifications', error);
        }
      }
    };
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (user) {
      // Connect to the backend
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const newSocket = io(backendUrl.replace('/api', ''), {
        transports: ['websocket', 'polling'],
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected', newSocket.id);
        // Register user ID with the socket server
        newSocket.emit('register', user._id);
      });

      newSocket.on('new_notification', (notification) => {
        // Increment unread count
        setUnreadCount((prev) => prev + 1);
        
        // Show toast
        toast(notification.title || 'New Notification', {
          icon: '🔔',
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: 'hsl(var(--surface))',
            color: 'hsl(var(--text))',
            border: '1px solid hsl(var(--border))',
          },
        });
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
