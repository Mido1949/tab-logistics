"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setCompanyId } from '@/lib/session';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');

      // Set company session (cookie + localStorage)
      if (data.company_id) {
        setCompanyId(data.company_id);
        // Also set via API for SSR cookie
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
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--background)', padding: '1rem' }}>
      <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo width={60} height={60} showText={false} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>أهلاً بك مجدداً</h2>
          <p style={{ color: 'var(--text-muted)' }}>سجل دخولك لمتابعة أعمالك</p>
        </div>

        {error && <div style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(220, 38, 38, 0.3)' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>تذكرني</span>
            </label>
            <Link href="/auth/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>نسيت كلمة المرور؟</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>أو الدخول باستخدام</span>
          <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📱</span>
            الدخول برقم الهاتف (OTP)
          </button>
          
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.8rem', background: 'rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
            الدخول بحساب Google
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)' }}>
          ليس لديك حساب؟ <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>أنشئ حساباً لشركتك</Link>
        </p>
      </div>
    </div>
  );
}
