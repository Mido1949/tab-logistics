"use client";
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      
      {/* Header */}
      <header className="animate-slide-up" style={{ textAlign: 'center', padding: '6rem 1rem 4rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>باقات الاشتراك</h2>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.2' }}>بساطة في السعر.. قوة في الأداء</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
          اختر الباقة التي تناسب حجم عملياتك. لا توجد رسوم خفية، فقط الحلول اللوجستية التي تحتاجها للنمو.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="grid-cols-3 container animate-slide-up delay-100" style={{ paddingBottom: '8rem', gap: '2.5rem', alignItems: 'stretch' }}>
        
        {/* Tier 1: Merchant/Sender */}
        <div className="card glass" style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', borderTop: '4px solid var(--secondary)' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>باقة المرسل (التاجر)</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', minHeight: '50px', fontSize: '1.05rem' }}>للشركات والتجار الذين يحتاجون لإرسال الشحنات بأفضل سعر وكفاءة.</p>
          
          <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              مجاناً
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>بدون اشتراك شهري</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span> تصدير طلبات شحن لا نهائية</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span> إدارة أوتوماتيكية للطلبات</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span> تتبع مباشر 24/7</li>
          </ul>

          <Link href="/auth/register">
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>سجل الآن مجاناً</button>
          </Link>
        </div>

        {/* Tier 2: Logistics Pro */}
        <div className="card" style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', border: '2px solid var(--primary)', position: 'relative', background: 'var(--surface)', transform: 'scale(1.05)', zIndex: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.5rem 1.8rem', borderRadius: '50px', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '0.05rem' }}>الخيار الأفضل</div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary)' }}>شركة شحن (برو)</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', minHeight: '50px', fontSize: '1.05rem' }}>للشركات التي ترغب في استقبال الطلبات وإدارة أسطولها باحترافية.</p>
          
          <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              74 <span style={{ fontSize: '1.2rem' }}>ج.م</span><span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ شهر</span>
            </div>
            <p style={{ color: 'var(--success)', fontWeight: '800', marginTop: '0.5rem', fontSize: '0.95rem' }}>أفضل قيمة للشركات الناشئة</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span> الوصول لجميع الطلبات المتاحة</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span> نظام إدارة المناديب والأسطول</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span> واجهة برمجية (API) مخصصة</li>
          </ul>

          <Link href="/auth/register">
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', boxShadow: '0 10px 20px rgba(220, 38, 38, 0.3)' }}>ابدأ الآن</button>
          </Link>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="card glass" style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', borderTop: '4px solid var(--warning)' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>المؤسسات الكبرى</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', minHeight: '50px', fontSize: '1.05rem' }}>حلول مخصصة للعمليات الضخمة والمتطلبات اللوجستية المعقدة.</p>
          
          <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              اتصل بنا
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>للحصول على عرض سعر مخصص</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--warning)', fontSize: '1.2rem' }}>✓</span> خادم مخصص (Dedicated Host)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--warning)', fontSize: '1.2rem' }}>✓</span> دعم فني مخصص على مدار الساعة</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><span style={{ color: 'var(--warning)', fontSize: '1.2rem' }}>✓</span> تكامل كامل مع أنظمة ERP الكبيرة</li>
          </ul>

          <Link href="/contact">
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>تواصل مع المبيعات</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
