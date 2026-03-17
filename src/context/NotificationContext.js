"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCompanyId } from '@/lib/session';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = React.useCallback(async () => {
    const cid = getCompanyId();
    if (!cid) return;

    try {
      const res = await fetch(`/api/notifications?company_id=${encodeURIComponent(cid)}`);
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    // Defer initial fetch to avoid synchronous setState inside effect warning
    const timer = setTimeout(() => {
      fetchNotifications();
    }, 0);
    
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    // Call API to mark as read
    await fetch(`/api/notifications/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, refresh: fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
