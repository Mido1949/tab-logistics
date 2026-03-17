"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCompanyId } from '@/lib/session';
import Navbar from '@/components/Navbar';
import TrackingMap from '@/components/TrackingMap';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'قيد الانتظار', icon: 'schedule' },
  { key: 'ACCEPTED', label: 'تم القبول', icon: 'check_circle' },
  { key: 'PICKED_UP', label: 'تم الاستلام', icon: 'inventory_2' },
  { key: 'IN_TRANSIT', label: 'جاري التوصيل', icon: 'local_shipping' },
  { key: 'DELIVERED', label: 'تم التسليم', icon: 'task_alt' }
];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const fetchOrderDetails = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/info?id=${id}`);
      const data = await res.json();
      if (data.order) {
        // Map DB Enum back to UI status
        if (data.order.status === 'CONFIRMED') data.order.status = 'ACCEPTED';
        if (data.order.status === 'SHIPPED') data.order.status = 'IN_TRANSIT';
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const cid = getCompanyId();
    if (!cid) {
      router.push('/auth/login');
      return;
    }
    fetchOrderDetails();

    // Auto-refresh order data every 10s for live tracking
    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [fetchOrderDetails, router]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      // Map UI status to DB Enum
      let dbStatus = newStatus;
      if (newStatus === 'ACCEPTED' || newStatus === 'PICKED_UP') dbStatus = 'CONFIRMED';
      if (newStatus === 'IN_TRANSIT') dbStatus = 'SHIPPED';

      const res = await fetch(`/api/orders/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, status: dbStatus })
      });
      if (res.ok) {
        await fetchOrderDetails();
      } else {
        alert('فشل تحديث الحالة');
      }
    } catch (err) {
      alert('خطأ في الاتصال');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}><Navbar /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-muted)' }}>جاري تحميل تفاصيل الشحنة...</div></div>;
  if (!order) return <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}><Navbar /><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-muted)' }}>الشحنة غير موجودة</div></div>;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      
      <main className="container" style={{ padding: '6rem 1rem' }}>
        <header className="flex-mobile-col" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>تفاصيل الشحنة</h2>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900' }}>أوردر #{order.id.slice(0, 8)}</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>تاريخ الإنشاء: {new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
          </div>
          <div className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : 'badge-pending'}`} style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
            {STATUS_STEPS.find(s => s.key === order.status)?.label}
          </div>
        </header>

        {/* Live Tracking Map */}
        <div style={{ marginBottom: '3rem' }}>
          <TrackingMap order={order} />
        </div>

        {/* Status Stepper */}
        <div className="card glass" style={{ padding: '3rem', marginBottom: '3rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', paddingBottom: '1rem' }}>
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: isCompleted ? 'var(--primary)' : 'var(--surface)', 
                    border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--border)'}`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: isCompleted ? 'white' : 'var(--text-muted)',
                    boxShadow: isCurrent ? '0 0 20px var(--primary)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </div>
                  <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', fontWeight: '700', color: isCompleted ? 'var(--text)' : 'var(--text-muted)' }}>{step.label}</p>
                  
                  {index < STATUS_STEPS.length - 1 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '25px', 
                      right: '-50%', 
                      width: '100%', 
                      height: '2px', 
                      background: index < currentStepIndex ? 'var(--primary)' : 'var(--border)',
                      zIndex: -1 
                    }}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Customer Info */}
          <div className="card glass" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>person</span> بيانات العميل
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>اسم المستلم</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{order.customer?.name || 'غير متوفر'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>رقم الهاتف</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{order.customer?.phone || '010XXXXXXXX'}</p>
                  <a href={`tel:${order.customer?.phone}`} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }} title="اتصال هاتفي">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>call</span>
                  </a>
                  <a href={`https://wa.me/2${order.customer?.phone}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px', color: '#25D366' }} title="واتساب">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>chat</span>
                  </a>
                </div>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>العنوان</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{order.customer?.address || 'غير متوفر'}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customer?.address || '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginLeft: '0.5rem' }}>map</span>
                  فتح في الخرائط
                </a>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="card glass" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>payments</span> ملخص التكاليف
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>مبلغ التحصيل (COD)</span>
                <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{order.total_amount || 0} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>مصاريف الشحن</span>
                <span style={{ fontWeight: '700' }}>{order.delivery_fee || 0} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>عمولة المنصة</span>
                <span style={{ fontWeight: '700', color: 'var(--danger)' }}>- {order.commission || 0} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>صافي المستحقات</span>
                <span style={{ fontWeight: '900', fontSize: '1.3rem', color: '#22c55e' }}>{(order.total_amount - (order.commission || 0)) || 0} ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-mobile-col items-center justify-center" style={{ display: 'flex', gap: '1.5rem' }}>
          {order.status !== 'DELIVERED' && (
            <button 
              className="btn btn-primary" 
              style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', minWidth: '200px' }}
              onClick={() => updateStatus(STATUS_STEPS[currentStepIndex + 1].key)}
              disabled={updating}
            >
              {updating ? 'جاري التحديث...' : `تحديث لـ: ${STATUS_STEPS[currentStepIndex + 1].label}`}
            </button>
          )}
          <button className="btn btn-secondary" style={{ padding: '1.2rem 2rem' }} onClick={() => router.back()}>
            العودة للخلف
          </button>
        </div>
      </main>
    </div>
  );
}
