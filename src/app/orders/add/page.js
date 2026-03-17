'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanyId } from '@/lib/session';

export default function AddOrderPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState('');
  const [originCompanyId, setOriginCompanyId] = useState('');
  const [destinationCompanyId, setDestinationCompanyId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [price, setPrice] = useState('0');
  const [items, setItems] = useState([{ product_id: '', quantity: 1, price: 0 }]);
  const [autoAssign, setAutoAssign] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  useEffect(() => {
    const cid = getCompanyId();
    if (!cid) {
      router.push('/auth/login');
      return;
    }

    // Geolocation enforcement
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocationStatus('success'),
        (err) => setLocationStatus('denied')
      );
    }

    fetch(`/api/companies/${cid}`)
      .then(res => res.json())
      .then(data => {
        if (data.company?.name) setOriginCompanyId(data.company.name);
      })
      .catch(e => console.error('Failed to pre-fill company:', e));
  }, [router]);

  const addItem = () => setItems((prev) => [...prev, { product_id: '', quantity: 1, price: 0 }]);
  const updateItem = (idx, updated) => {
    const next = [...items];
    next[idx] = updated;
    setItems(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const payload = {
      customerId,
      originCompanyId,
      destinationCompanyId,
      regionId,
      price: parseFloat(price),
      items,
      autoAssignBestPartner: autoAssign
    };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل إضافة الطلب');
      setSuccess(true);
      setCustomerId('');
      setPrice('0');
      setItems([{ product_id: '', quantity: 1, price: 0 }]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass animate-slide-up" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '900px', margin: '3rem auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>إضافة طلب شحن جديد 📦</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>أدخل تفاصيل الشحنة وسيتم توجيهها ذكياً عبر النظام</p>
      </header>

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', border: '1px solid var(--success)' }}>
          ✅ تم إضافة الطلب بنجاح!
        </div>
      )}

      {locationStatus === 'denied' && (
        <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '12px', color: 'var(--text)', marginBottom: '2rem', textAlign: 'center' }}>
          <strong style={{ color: 'var(--danger)' }}>⚠️ تنبيه هام:</strong> لا يمكن إضافة طلبات دون تحديد موقعك الجغرافي. يُرجى تفعيل الموقع.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: locationStatus === 'denied' ? 0.5 : 1, pointerEvents: locationStatus === 'denied' ? 'none' : 'auto' }}>
        <div className="grid-cols-2">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>اسم العميل أو الكود</label>
            <input required placeholder="مثل: أحمد محمد أو CUST-01" value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>منطقة التوصيل</label>
            <input required placeholder="مثل: القاهرة، الإسكندرية..." value={regionId} onChange={(e) => setRegionId(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
          </div>
        </div>

        <div className="grid-cols-2">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>شركة المنشأ</label>
            <input placeholder="اسم شركتك" value={originCompanyId} onChange={(e) => setOriginCompanyId(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '2rem' }}>
            <input type="checkbox" id="autoAssign" checked={autoAssign} onChange={(e) => setAutoAssign(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            <label htmlFor="autoAssign" style={{ color: 'var(--secondary)', fontWeight: 'bold', cursor: 'pointer' }}>تفعيل التوجيه التلقائي الذكي (AI) ⚡</label>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>السعر الإجمالي للطلب (ج.م)</label>
          <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white' }} />
        </div>

        <div style={{ padding: '2rem', borderRadius: '20px', border: '1px dashed var(--border)', background: 'rgba(15, 23, 42, 0.4)' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📦</span> محتويات الشحنة
          </h3>
          {items.map((it, idx) => (
            <div className="item-row grid-cols-3 animate-slide-up" key={idx} style={{ marginBottom: '1rem' }}>
              <input required placeholder="اسم المنتج (مثال: لابتوب)" value={it.product_id} onChange={(e) => updateItem(idx, { ...it, product_id: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'white' }} />
              <input required placeholder="الكمية" type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, { ...it, quantity: parseInt(e.target.value) || 1 })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'white' }} />
              <input required placeholder="السعر" type="number" step="0.01" value={it.price} onChange={(e) => updateItem(idx, { ...it, price: parseFloat(e.target.value) || 0 })} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'white' }} />
            </div>
          ))}
          <button type="button" onClick={addItem} className="btn btn-secondary" style={{ marginTop: '1rem' }}>+ إضافة منتج آخر</button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button disabled={loading} type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>{loading ? 'جاري الحفظ...' : 'إرسال الطلب'}</button>
        </div>
      </form>

      <style jsx>{`
        .item-row input { width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border); background: var(--background); color: white; }
      `}</style>
    </section>
  );
}
