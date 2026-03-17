'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCompanyId } from '@/lib/session';

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState(null);

  useEffect(() => {
    const cid = getCompanyId();
    if (!cid) {
      router.push('/auth/login');
      return;
    }

    // Prompt for Geolocation (Mandatory Business Rule)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocationStatus('success'),
        (err) => setLocationStatus('denied')
      );
    }
    async function fetchOrders() {
      try {
        const cid = getCompanyId();
        const url = cid ? `/api/orders?company_id=${encodeURIComponent(cid)}` : '/api/orders';
        const res = await fetch(url);
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [router]);

  return (
    <div className="animate-slide-up" style={{ padding: '2rem 1rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.8rem' }}>صباح الخير 👋</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>إليك ملخص نشاطك اليوم</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => router.push('/dashboard/verification')}>
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }}>verified_user</span>
            توثيق الحساب
          </button>
          <button className="btn btn-primary animate-slide-up delay-100" style={{ padding: '1rem 2rem' }} onClick={() => router.push('/orders/add')}>+ إضافة أوردر جديد</button>
        </div>
      </header>

      {/* Verification Banner */}
      <div className="card glass animate-fade-in flex-mobile-col" style={{ padding: '1.5rem', background: 'rgba(255, 165, 0, 0.05)', border: '1px solid var(--warning)', borderRadius: '15px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255, 165, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text)' }}>حساب غير موثق</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>يُرجى رفع المستندات الرسمية لضمان استمرارية الخدمة والوصول لكافة المميزات.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/dashboard/verification')} style={{ fontSize: '0.9rem', padding: '0.7rem 1.5rem' }}>ابدأ التوثيق الآن</button>
      </div>

      {locationStatus === 'denied' && (
        <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '12px', color: 'var(--text)', marginBottom: '2rem' }}>
          <strong style={{ color: 'var(--danger)' }}>⚠️ تنبيه هام:</strong> لم تقم بمنح صلاحية الموقع الجغرافي. للحفاظ على موثوقية المنصة وشفافية توزيع الأوردرات، يُرجى تفعيل الموقع من إعدادات المتصفح.
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid-cols-3 animate-slide-up delay-100" style={{ marginBottom: '4rem' }}>
        <div className="card glass" style={{ borderTop: '4px solid var(--primary)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.8rem', fontSize: '1.1rem', fontWeight: 'bold' }}>أوردرات قيد التنفيذ</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text)' }}>{orders.length}</h3>
        </div>
        <div className="card glass" style={{ borderTop: '4px solid var(--secondary)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.8rem', fontSize: '1.1rem', fontWeight: 'bold' }}>تم التوصيل (اليوم)</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--secondary)' }}>0</h3>
        </div>
        <div className="card glass hover:border-primary transition-all" style={{ borderTop: '4px solid var(--warning)', cursor: 'pointer' }} onClick={() => router.push('/dashboard/finance')}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.8rem', fontSize: '1.1rem', fontWeight: 'bold' }}>المستحقات المالية</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--warning)' }}>0 ج.م</h3>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card glass animate-slide-up delay-200">
        <h4 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '800', color: 'var(--primary)' }}>أحدث الأوردرات</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>جاري تحميل البيانات...</p>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }} className="hover:border-primary">
                  <div>
                    <p style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.4rem' }}>أوردر #{order.id.slice(0,8)}</p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>المنطقة: {order.region_id}</p>
                  </div>
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className={`badge ${order.status === 'PENDING' ? 'badge-pending' : 'badge-success'}`}>{order.status === 'PENDING' ? 'قيد الانتظار' : 'مكتمل'}</span>
                    <p style={{ fontWeight: '900', color: 'var(--text)', fontSize: '1.1rem' }}>{order.price} ج.م</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>لا توجد أوردرات حالياً</p>
          )}
        </div>
      </div>
    </div>
  );
}
