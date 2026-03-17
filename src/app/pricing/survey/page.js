"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingSurveyPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState('');
  const [orderVolume, setOrderVolume] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate analyzing logic & storing data
    setTimeout(() => {
      // Data would be saved to DB here to trigger future push notifications to matches.
      console.log('Survey Data Submitted:', { employees, orderVolume });
      router.push('/pricing');
    }, 1200);
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: '100vh', padding: '1rem', background: 'var(--background)' }}>
      <main className="card glass animate-slide-up" style={{ maxWidth: '600px', width: '100%', padding: '3rem', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '70px', height: '70px', background: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)' }}>📊</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', marginBottom: '0.8rem' }}>لنحدد العرض الأنسب لك</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>الإجابة على هذه الأسئلة القصيرة يساعدنا في إعداد تنبيهات للسوق وتخصيص تجربتك بشكل أفضل.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', fontSize: '1.1rem', color: 'var(--text)' }}>
              1. ما هو عدد موظفي شركتك تقريباً؟
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['1 - 5', '6 - 20', '21 - 50', '+50'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setEmployees(opt)}
                  className="btn"
                  style={{ 
                    flex: '1', minWidth: '100px', padding: '1rem', background: employees === opt ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255, 255, 255, 0.03)', 
                    border: `2px solid ${employees === opt ? 'var(--primary)' : 'var(--border)'}`, 
                    color: employees === opt ? 'var(--primary)' : 'var(--text-muted)' 
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', fontSize: '1.1rem', color: 'var(--text)' }}>
              2. ما هو حجم الأوردرات المتاح في الشركة حالياً تقريباً؟ (شهرياً)
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['أقل من 100', '100 - 500', '500 - 2000', '+2000'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOrderVolume(opt)}
                  className="btn"
                  style={{ 
                    flex: '1', minWidth: '100px', padding: '1rem', background: orderVolume === opt ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255, 255, 255, 0.03)', 
                    border: `2px solid ${orderVolume === opt ? 'var(--primary)' : 'var(--border)'}`, 
                    color: orderVolume === opt ? 'var(--primary)' : 'var(--text-muted)' 
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={!employees || !orderVolume || isSubmitting} 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.2rem', opacity: (!employees || !orderVolume) ? 0.5 : 1 }}
            >
              {isSubmitting ? 'جاري تحليل بياناتك وتجهيز العرض...' : 'عرض الباقات المناسبة'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
