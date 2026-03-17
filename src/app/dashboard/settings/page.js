'use client';
import { useEffect, useState } from 'react';
import { getCompanyId } from '@/lib/session';

export default function SettingsPage() {
  const [company, setCompany] = useState(null);
  const [regions, setRegions] = useState([]);
  const [myRegions, setMyRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const cid = getCompanyId();

  useEffect(() => {
    if (!cid) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // 1. Fetch Company Profile
        const resComp = await fetch(`/api/companies/${cid}`);
        const dataComp = await resComp.json();
        setCompany(dataComp.company);

        // 2. Fetch All Regions
        const resRegs = await fetch('/api/regions');
        const dataRegs = await resRegs.json();
        setRegions(dataRegs.regions ?? []);

        // 3. Fetch My Regions
        const resMyRegs = await fetch(`/api/companies/${cid}/regions`);
        const dataMyRegs = await resMyRegs.json();
        setMyRegions(dataMyRegs.regions?.map(r => r.id) ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [cid]);

  const toggleRegion = (regId) => {
    if (myRegions.includes(regId)) {
      setMyRegions(myRegions.filter(id => id !== regId));
    } else {
      setMyRegions([...myRegions, regId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Save Regions
      const resRegions = await fetch(`/api/companies/${cid}/regions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regions: myRegions })
      });
      if (!resRegions.ok) throw new Error('فشل حفظ المناطق');

      // 2. Save Verification Docs
      const resVerify = await fetch(`/api/companies/${cid}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tax_id_doc_url: company?.tax_id_doc_url,
          commercial_registry_doc_url: company?.commercial_registry_doc_url
        })
      });
      if (!resVerify.ok) throw new Error('فشل حفظ وثائق التوثيق');

      alert('تم حفظ كافة التغييرات وإرسال الطلب للمراجعة!');
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>جاري التحميل...</div>;
  if (!cid) return <div style={{ padding: '2rem' }}>يرجى تسجيل الدخول.</div>;

  return (
    <section className="glass animate-fade-in" style={{ padding: '2rem', borderRadius: '16px', margin: '2rem auto', maxWidth: '800px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>إعدادات الشركة ⚙️</h2>
        <p style={{ color: 'var(--text-muted)' }}>إدارة ملفك الشخصي وتغطية المناطق</p>
      </header>

      <div className="card glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>المعلومات الأساسية</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>اسم الشركة</label>
            <input 
              readOnly 
              value={company?.name || ''} 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>البريد الإلكتروني للتواصل</label>
            <input 
              readOnly 
              value={company?.contact_email || ''} 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
            />
          </div>
        </div>
      </div>

      <div className="card glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>تغطية المناطق</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>اختر المناطق التي تستطيع شركتك العمل فيها للحصول على ترشيحات ذكية.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {regions.map(r => (
            <div 
              key={r.id} 
              onClick={() => toggleRegion(r.id)}
              style={{ 
                padding: '0.8rem', 
                borderRadius: '12px', 
                border: '1px solid', 
                borderColor: myRegions.includes(r.id) ? 'var(--primary)' : 'var(--border)',
                background: myRegions.includes(r.id) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                color: myRegions.includes(r.id) ? 'white' : 'var(--text-muted)'
              }}
            >
              {r.name}
            </div>
          ))}
        </div>
      </div>

      <div className="card glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--primary)' }}>التوثيق ودرع الثقة 🛡️</h3>
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            background: company?.verification_status === 'VERIFIED' ? '#10b981' : company?.verification_status === 'PENDING' ? '#3b82f6' : '#6b7280',
            color: 'white'
          }}>
            {company?.verification_status === 'VERIFIED' ? 'موثق' : company?.verification_status === 'PENDING' ? 'قيد المراجعة' : 'غير موثق'}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          ارفع وثائق الشركة (السجل التجاري والبطاقة الضريبية) للحصول على شارة التوثيق وأولوية في ترشيحات الـ AI.
        </p>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>رابط السجل التجاري (PDF/Image)</label>
            <input 
              placeholder="ضع رابط الملف هنا..."
              defaultValue={company?.commercial_registry_doc_url || ''}
              onBlur={(e) => setCompany({ ...company, commercial_registry_doc_url: e.target.value })}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>رابط البطاقة الضريبية (PDF/Image)</label>
            <input 
              placeholder="ضع رابط الملف هنا..."
              defaultValue={company?.tax_id_doc_url || ''}
              onBlur={(e) => setCompany({ ...company, tax_id_doc_url: e.target.value })}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
            />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'left' }}>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary" 
          style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}
        >
          {saving ? 'جاري الحفظ...' : 'حفظ كل التغييرات'}
        </button>
      </div>
    </section>
  );
}
