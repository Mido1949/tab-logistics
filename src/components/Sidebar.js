"use client";
import { useEffect, useState } from 'react';
import { getCompanyId } from '@/lib/session';
import Link from 'next/link';

export default function Sidebar() {
  const [notifCount, setNotifCount] = useState(0);
  const cid = getCompanyId();
  useEffect(() => {
    if (!cid) return;
    fetch(`/api/notifications?company_id=${cid}`)
      .then((r) => r.json())
      .then((data) => {
        const count = Array.isArray(data.notifications) ? data.notifications.filter(n => !n.is_read).length : 0;
        setNotifCount(count);
      })
      .catch(() => setNotifCount(0));
  }, [cid]);

  const menuItems = [
    { title: "الرئيسية", icon: "🏠", href: "/dashboard" },
    { title: "إضافة أوردر (مفرد)", icon: "➕", href: "/orders/add" },
    { title: "رفع مجمع (CSV)", icon: "📋", href: "/orders/batch" },
    { title: "قائمة الأوردرات", icon: "📦", href: "/orders/list" },
    { title: "الأوردرات المتاحة", icon: "🛒", href: "/orders/available" },
    { title: "تسجيل شركة جديدة", icon: "🏢", href: "/companies/register" },
    { title: "المعاملات المالية", icon: "💰", href: "/dashboard/finance" },
    { title: "الإعدادات", icon: "⚙️", href: "/dashboard/settings" },
  ];
  // Notification badge item (optional visual cue)
  const notifItem = { title: `إشعارات (${notifCount})`, icon: "🔔", href: "/dashboard/notifications" };

  return (
    <aside className="glass" style={{ width: '280px', height: 'calc(100vh - 2rem)', margin: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>لوحة التحكم</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1rem', 
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            textDecoration: 'none'
          }} className="sidebar-link">
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <span style={{ fontWeight: '500' }}>{item.title}</span>
          </Link>
        ))}
        <Link href={notifItem.href} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 1rem', borderRadius:'12px' }} className="sidebar-link">
          <span style={{ fontSize:'1.25rem' }}>{notifItem.icon}</span>
          <span style={{ fontWeight:'500' }}>{notifItem.title}</span>
        </Link>
      </div>

      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>تسجيل الخروج</button>
      </div>

      <style jsx>{`
        .sidebar-link:hover {
          background: var(--surface);
          color: var(--primary);
        }
      `}</style>
    </aside>
  );
}
