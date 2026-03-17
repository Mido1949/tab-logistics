"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanyId } from '@/lib/session';

const DOC_TYPES = [
  { id: 'commercial_registry', label: 'السجل التجاري', description: 'نسخة حديثة لاقدم من 3 أشهر', icon: 'description' },
  { id: 'tax_card', label: 'البطاقة الضريبية', description: 'صورة الواجهة الأمامية والخلفية', icon: 'payments' },
  { id: 'national_id', label: 'بطاقة هوية المالك', description: 'البطاقة الشخصية سارية المفعول', icon: 'badge' }
];

export default function VerificationPage() {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [status, setStatus] = useState('UNVERIFIED'); // UNVERIFIED, UNDER_REVIEW, VERIFIED
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cid = getCompanyId();
    if (!cid) {
      router.push('/auth/login');
      return;
    }
    
    async function checkStatus() {
      try {
        const res = await fetch(`/api/companies/info?id=${cid}`);
        const data = await res.json();
        if (data.company) {
          setStatus(data.company.verification_status || 'UNVERIFIED');
        }
      } catch (err) {
        console.error('Failed to fetch verification status:', err);
      }
    }
    checkStatus();
  }, []);

  const handleFileChange = (typeId, e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [typeId]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [typeId]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const cid = getCompanyId();
    if (Object.keys(files).length < 3) {
      alert('يجب رفع جميع الملفات المطلوبة (السجل، البطاقة الضريبية، الهوية)');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('companyId', cid);
      formData.append('commercial_registry', files.commercial_registry);
      formData.append('tax_card', files.tax_card);
      formData.append('national_id', files.national_id);

      const res = await fetch('/api/companies/verify', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus('UNDER_REVIEW');
        alert('تم رفع الملفات بنجاح! سيتم مراجعة طلبك خلال 24 ساعة.');
      } else {
        alert(data.error || 'فشل الرفع، يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      
      
      <main className="container" style={{ padding: '8rem 1rem 6rem' }}>
        <header style={{ marginBottom: '4rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>أمان وموثوقية</h2>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>توثيق هوية الشركة</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: '1.7', fontWeight: '500' }}>
            لضمان بيئة عمل آمنة وحماية حقوق جميع الأطراف، نطلب من الشركات رفع الوثائق الرسمية لتفعيل الحساب بالكامل.
          </p>
        </header>

        {status === 'UNDER_REVIEW' ? (
          <div className="card glass" style={{ textAlign: 'center', padding: '6rem', border: '1px solid var(--warning)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '5rem', color: 'var(--warning)', marginBottom: '2rem' }}>history_toggle_off</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>طلبك قيد المراجعة</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>نحن نقوم الآن بمراجعة مستنداتك. ستصلك رسالة حال تفعيل حسابك.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {DOC_TYPES.map((doc) => (
              <div key={doc.id} className="card glass hover:border-primary transition-all" style={{ padding: '2.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <span className="material-symbols-outlined">{doc.icon}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text)' }}>{doc.label}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{doc.description}</p>
                  </div>
                </div>

                <div 
                  style={{ 
                    border: previews[doc.id] ? '2px solid var(--primary)' : '2px dashed var(--border)', 
                    borderRadius: '15px', 
                    height: '200px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'rgba(255,255,255,0.02)'
                  }}
                >
                  {previews[doc.id] ? (
                    <img src={previews[doc.id]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--border)', marginBottom: '1rem' }}>cloud_upload</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>اسحب الملف هنا أو انقر للاختيار</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    onChange={(e) => handleFileChange(doc.id, e)} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                    accept="image/*,application/pdf"
                  />
                </div>
              </div>
            ))}

            <div style={{ gridColumn: '1 / -1', marginTop: '3rem', textAlign: 'center' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit} 
                disabled={loading}
                style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', boxShadow: '0 10px 30px rgba(0, 123, 255, 0.3)' }}
              >
                {loading ? 'جاري رفع المستندات...' : 'إرسال لطلب التوثيق'}
              </button>
              <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                * برفعك لهذه الملفات، أنت تقر بصحة البيانات المقدمة وتفوضنا بمراجعتها.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
