"use client";
import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <main className="container" style={{ padding: '8rem 1rem 6rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>تواصل معنا</h2>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>نحن هنا لدعم نموك</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            لديك سؤال؟ أو ترغب في الانضمام لشبكتنا؟ فريقنا جاهز للرد على جميع استفساراتك في أسرع وقت.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          {/* Contact Info */}
          <div className="animate-slide-up">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="glass" style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>mail</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--text)' }}>البريد الإلكتروني</h4>
                  <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>support@tab-logistics.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="glass" style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>call</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--text)' }}>رقم الهاتف</h4>
                  <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>+20 123 456 7890</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="glass" style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>location_on</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--text)' }}>المقر الرئيسي</h4>
                  <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>المعادي، القاهرة، جمهورية مصر العربية</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="card" style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>ساعات العمل</h4>
              <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem' }}>الأحد - الخميس: 9:00 ص - 6:00 م</p>
              <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>الجمعة - السبت: مغلق</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card glass animate-slide-up" style={{ padding: '3rem', border: '1px solid var(--border)', position: 'relative' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--text)' }}>أرسل لنا رسالة</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)' }}>الاسم بالكامل</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)' }}>البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)' }}>الموضوع</label>
                <input 
                  type="text" 
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)' }}>الرسالة</label>
                <textarea 
                  required 
                  rows="5" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', resize: 'none' }} 
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={status === 'sending'}
                style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem' }}
              >
                {status === 'sending' ? 'جاري الإرسال...' : status === 'success' ? 'تم الإرسال بنجاح!' : 'إرسال الرسالة'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
