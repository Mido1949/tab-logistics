"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanyId } from '@/lib/session';
import Navbar from '@/components/Navbar';

export default function AvailableOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cid = getCompanyId();
    if (!cid) {
      router.push('/auth/login');
      return;
    }

    async function fetchAvailable() {
      try {
        const res = await fetch('/api/orders/available');
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch (err) {
        console.error('Failed to fetch available orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailable();
  }, [router]);

  const handleAccept = async (orderId) => {
    setAcceptingId(orderId);
    try {
      const cid = getCompanyId();
      const res = await fetch('/api/orders/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, companyId: cid })
      });
      
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        alert('تم قبول الشحنة بنجاح! ننتظرك لتسليمها.');
      } else {
        const data = await res.json();
        alert(data.error || 'فشل قبول الشحنة');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالسيرفر');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      
      <main className="container" style={{ padding: '6rem 1rem' }}>
        <header className="flex-mobile-col" style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>السوق اللوجستي</h2>
            <h1 className="gradient-text hero-title" style={{ fontWeight: '900', marginBottom: '1.5rem' }}>شحنات متاحة للتبادل</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: '1.7', fontWeight: '500' }}>
              تصفح الشحنات المنشورة من قبل التجار وشركات الشحن الأخرى. اقبل الشحنة التي تناسب خطوط سيرك.
            </p>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>جاري البحث عن شحنات متاحة...</p>
          </div>
        ) : orders.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {orders.map((order) => (
              <div key={order.id} className="card glass animate-slide-up" style={{ padding: '2rem 1.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.3s ease' }}>
                <div className="flex-mobile-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(255,165,0,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', textTransform: 'uppercase' }}>
                      {order.region?.name || 'منطقة غير محددة'}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '1rem', color: 'var(--text)' }}>شحنة #{order.id.slice(0, 8)}</h3>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text)' }}>{order.price} <small style={{ fontSize: '0.9rem' }}>ج.م</small></p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>business</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>من: {order.origin_company?.name || 'شركة مجهولة'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>package_2</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>عدد القطع: {order.order_items?.length || 1}</span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  disabled={acceptingId === order.id}
                  onClick={() => handleAccept(order.id)}
                  style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem' }}
                >
                  {acceptingId === order.id ? 'جاري القبول...' : 'قبول وتنفيذ الشحنة'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card glass" style={{ textAlign: 'center', padding: '6rem', border: '2px dashed var(--border)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--border)', marginBottom: '1.5rem' }}>inventory_2</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>لا توجد شحنات متاحة حالياً في منطقتك</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>سيتم إخطارك فور توفر شحنات جديدة.</p>
          </div>
        )}
      </main>
    </div>
  );
}
