'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  timestamp: Date;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          // Convert string dates back to Date objects
          const notificationsWithDates = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
          setNotifications(notificationsWithDates);
        } catch (error) {
          console.error('Failed to parse saved notifications:', error);
        }
      }
    }
  }, [user?.id]);

  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    if (user?.id) {
      try {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(newNotifications));
      } catch (error) {
        console.error('Failed to save notifications:', error);
      }
    }
  }, [user?.id]);
  
  // Calculate unread count based on current notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      timestamp: new Date()
    };
    
    saveNotifications([newNotification, ...notifications]);
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications(current => 
      current.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(current => 
      current.map(n => n.read ? n : { ...n, read: true })
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        getUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
