'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCompanyId } from '@/lib/session';

export default function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function init() {
      const url = new URL(window.location.href);
      const cidFromUrl = url.searchParams.get('company_id');
      const cid = cidFromUrl || getCompanyId();
      
      if (!ignore) {
        if (cid) {
          setCompanyId(cid);
        } else {
          setLoading(false);
        }
      }
    }
    init();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (!companyId) return;
    
    let ignore = false;
    fetch(`/api/orders?company_id=${encodeURIComponent(companyId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!ignore) {
          setOrders(data.orders ?? []);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, [companyId]);

  return (
    <section className="glass animate-slide-up" style={{ padding: '3rem' }}>
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900' }}>قائمة الطلبات</h2>
          <p style={{ color: 'var(--text-muted)' }}>استعراض ومتابعة كافة الطلبات الصادرة من شركتك</p>
        </div>
        <Link href="/orders/add" className="btn btn-primary">+ إضافة طلب جديد</Link>
      </header>

      {!companyId && !loading && (
        <div className="card glass" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>⚠️ لا يمكن استرجاع الطلبات. لم يتم العثور على معرّف للشركة في الجلسة.</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="animate-fade-in">جارٍ تحميل الطلبات...</p>
        </div>
      )}

      {!loading && companyId && (
        <div className="grid-cols-3">
          {orders.length > 0 ? orders.map((o, index) => (
            <div key={o.id} className={`card glass animate-slide-up delay-${(index % 3 + 1) * 100}`} style={{ padding: '1.5rem', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '1.2rem' }}>#{o.id.slice(0, 8)}</span>
                <span className={`badge ${o.status === 'PENDING' ? 'badge-pending' : 'badge-success'}`}>{o.status === 'PENDING' ? 'قيد الانتظار' : 'مكتمل'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>المنطقة:</span>
                  <span style={{ fontWeight: '600' }}>{o.region_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>الإجمالي:</span>
                  <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>{o.price} ج.م</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>تاريخ الطلب:</span>
                  <span style={{ fontSize: '0.9rem' }}>{new Date(o.created_at).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
              <Link href={`/orders/${o.id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>التفاصيل الكاملة</Link>
            </div>
          )) : (
            <div className="card glass" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>لا توجد طلبات مسجلة لهذه الشركة حالياً.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
