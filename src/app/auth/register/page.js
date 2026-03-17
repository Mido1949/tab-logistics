"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setCompanyId } from '@/lib/session';
import Logo from '@/components/Logo';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل إنشاء الحساب');

      // Set company session (cookie + localStorage)
      if (data.company_id) {
        setCompanyId(data.company_id);
        await fetch('/api/auth/set-company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company_id: data.company_id })
        });
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--background)', padding: '2rem 1rem' }}>
      <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo width={60} height={60} showText={false} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>إنشاء حساب لشركتك</h2>
          <p style={{ color: 'var(--text-muted)' }}>ابدأ الآن في تلبية الأوردرات وزيادة أرباحك</p>
        </div>

        {error && <div style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(220, 38, 38, 0.3)' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>اسم الشركة</label>
              <input 
                name="companyName"
                type="text" 
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="شركة الفهد للشحن" 
                style={{ width: '100%' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>رقم التواصل (واتساب)</label>
              <input 
                name="phone"
                type="tel" 
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="010XXXXXXXX" 
                style={{ width: '100%' }} 
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>البريد الإلكتروني</label>
            <input 
              name="email"
              type="email" 
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="example@company.com" 
              style={{ width: '100%' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>كلمة المرور</label>
              <input 
                name="password"
                type="password" 
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                style={{ width: '100%' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>تأكيد كلمة المرور</label>
              <input 
                name="confirmPassword"
                type="password" 
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••" 
                style={{ width: '100%' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب بالبريد'}
          </button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>أو التسجيل السريع</span>
          <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }}>
            <span>📱</span> إنشاء بـ OTP
          </button>
          
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', background: 'rgba(255, 255, 255, 0.08)' }}>
            <span>🌐</span> التسجيل بـ Google
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)' }}>
          عندك حساب فعلاً؟ <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>سجل دخولك</Link>
        </p>
      </div>
    </div>
  );
}
