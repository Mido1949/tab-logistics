"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء الإرسال');

      setMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح. يرجى مراجعة صندوق الوارد.');
      setLoading(false);
      
      // Auto redirect after 4 seconds
      setTimeout(() => router.push('/auth/login'), 4000);
    } catch (err) {
      setError(err.message || 'حدث خطأ غير متوقع');
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--background)', padding: '1rem' }}>
      <div className="card glass animate-slide-up" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo width={60} height={60} showText={false} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>نسيت كلمة المرور؟</h2>
          <p style={{ color: 'var(--text-muted)' }}>أدخل بريدك الإلكتروني وسنرسل لك رابطاً مؤقتاً لتعيين كلمة مرور جديدة</p>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', border: '1px solid var(--secondary)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', textAlign: 'center' }}>{message}</div>}

        {!message && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>البريد الإلكتروني المسجل</label>
              <input 
                name="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com" 
                style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/auth/login" style={{ color: 'var(--text-muted)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>←</span> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
