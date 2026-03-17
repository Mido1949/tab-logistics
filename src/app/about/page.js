"use client";
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <main className="container" style={{ padding: '6rem 1rem' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#c2410c', letterSpacing: '0.2rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>قصتنا وأهدافنا</h2>
          <h1 className="hero-title" style={{ fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1', color: '#000000' }}>بناء مستقبل الشحن <span style={{ color: '#c2410c' }}>في مصر</span></h1>
          <p style={{ fontSize: '1.3rem', color: '#1a202c', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', fontWeight: '500' }}>
            نحن هنا لنعيد تعريف الكفاءة اللوجستية. &quot;تاب&quot; ليست مجرد منصة تقنية، بل هي العقل المدبر لعمليات تبادل الشحنات التي تهدف لنمو الشركات وتوفير التكاليف.
          </p>
        </section>

        {/* Stats Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h3 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>92%</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>معدل نمو الشركات</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>بناءً على تقارير الأداء السنوية</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h3 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.5rem' }}>14+</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>موزع إقليمي</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>نغطي جميع محافظات الجمهورية</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h3 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>24h</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>متوسط وقت التوصيل</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>داخل القاهرة الكبرى والإسكندرية</p>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--text)' }}>لماذا بدأنا &quot;تاب&quot;؟</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.9', marginBottom: '2rem' }}>
              لاحظنا وجود فجوة كبيرة في سوق اللوجستيات المصري؛ شركات شحن لديها مناديب شاغرين، وشركات أخرى لديها أوردرات تفوق طاقتها. 
            </p>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.9' }}>
              من هنا ولدت فكرة &quot;الأوركسترا&quot; – تنسيق ذكي يربط العرض بالطلب، ويضمن حماية مالية كاملة لجميع الأطراف، مما يساعد الشركات الصغيرة على أن تصبح مؤسسات كبرى.
            </p>
          </div>
          <div className="glass" style={{ padding: '3rem', borderRadius: '40px', border: '1px solid var(--primary-dark)', position: 'relative' }}>
             <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem' }}>
                <p style={{ fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--text)', fontWeight: '600' }}>
                   &quot;رؤيتنا هي أن تكون تاب هي العمود الفقري لكل حركة شحن داخل مصر والشرق الأوسط.&quot;
                </p>
                <p style={{ marginTop: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>— الفريق المؤسس لـ تاب</p>
             </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <Link href="/pricing">
            <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1.2rem 4rem' }}>انضم لشركاء النجاح</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
