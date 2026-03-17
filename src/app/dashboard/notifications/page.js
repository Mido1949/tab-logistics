'use client';
import { useEffect, useState } from 'react';
import { getCompanyId } from '@/lib/session';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const cid = getCompanyId();

  useEffect(() => {
    let ignore = false;
    const loadNotifications = async () => {
      try {
        const urlCid = cid || '';
        const res = await fetch(`/api/notifications?company_id=${encodeURIComponent(urlCid)}`);
        const data = await res.json();
        if (!ignore) {
          setNotifications(data.notifications ?? []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (!cid) {
      setLoading(false);
      return;
    }
    loadNotifications();
    return () => { ignore = true; };
  }, [cid]);

  const markRead = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>🔔 الإشعارات</h1>
        <p style={{ color: 'var(--text-muted)' }}>تابع آخر التحديثات والطلبات المقبولة</p>
      </header>

      {loading && <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>جارٍ التحميل...</div>}
      
      {!loading && notifications.length === 0 && (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
          لا توجد إشعارات حالياً.
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {notifications.map((n) => (
          <div key={n.id} className="glass card" style={{ 
            padding: '1.5rem', 
            borderLeft: n.is_read ? 'none' : '4px solid var(--primary)',
            opacity: n.is_read ? 0.7 : 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{n.title}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {new Date(n.created_at).toLocaleString('ar-EG')}
              </span>
            </div>
            <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>{n.message}</p>
            {!n.is_read && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => markRead(n.id)}>
                   تحديد كمقروء
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
