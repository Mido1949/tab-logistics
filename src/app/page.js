export default function Home() {
  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <section className="container flex items-center justify-center" style={{ padding: '4rem 1rem', minHeight: 'calc(100vh - 100px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center', width: '100%' }}>
          <div className="animate-slide-up">
            <div className="badge badge-urgent animate-pulse" style={{ marginBottom: '1.5rem' }}>
              🔴 متاح الآن في القاهرة والإسكندرية
            </div>
            <h1 className="gradient-text hero-title" style={{ fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1' }}>
              الجيل القادم من <span style={{ color: 'var(--primary)' }}>الأوركسترا</span> اللوجستية
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.7' }}>
              اربط عملياتك، شحنك، وتجارتك في منصة واحدة مدعومة بالذكاء الاصطناعي. كفاءة صناعية بتصميم عصري يناسب طموحات الشركات المصرية.
            </p>
            <div className="hero-buttons flex items-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
              <button className="btn btn-primary">ابدأ التجربة المجانية</button>
              <button className="btn btn-secondary">احجز تجربة حية</button>
            </div>
          </div>

          {/* Hero Illustration (Simplified & Clean) */}
          <div className="animate-fade-in md:flex hidden" style={{ position: 'relative', height: '400px', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{ width: '320px', height: '320px', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--primary-dark)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '100px', color: 'var(--primary)', opacity: 0.9 }}>precision_manufacturing</span>
              
              {/* Discrete Floating Elements */}
              <div className="glass md:flex hidden" style={{ position: 'absolute', top: '10%', right: '10%', padding: '0.8rem', borderRadius: '15px', border: '1px solid var(--border)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--text)' }}>inventory_2</span>
              </div>
              <div className="btn-primary md:flex hidden" style={{ position: 'absolute', bottom: '10%', left: '10%', padding: '0.8rem', borderRadius: '15px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'white' }}>local_shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container" style={{ padding: '6rem 1rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>كيف تعمل &quot;تاب لوجستيكس&quot;؟</h2>
          <div style={{ width: '80px', height: '6px', background: 'var(--primary)', margin: '0 auto', borderRadius: '10px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', position: 'relative' }}>
          {/* Connector Line (Desktop Only) */}
          <div className="md:block hidden" style={{ position: 'absolute', top: '100px', left: '0', right: '0', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>

          {/* Step 1 */}
          <div className="card animate-slide-up" style={{ position: 'relative', zIndex: 1, padding: '3rem 2rem' }}>
            <div className="btn-primary" style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem' }}>01</div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '800' }}>اربط أنظمتك</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
              ادمج متجرك الإلكتروني أو نظام مخازنك في دقائق من خلال API سهل وبسيط مصمم للسوق المصري.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card animate-slide-up delay-100" style={{ position: 'relative', zIndex: 1, padding: '3rem 2rem' }}>
            <div className="btn-primary" style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem' }}>02</div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '800' }}>أوركسترا التدفق</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
              خوارزميات الذكاء الاصطناعي بتنظم خطوط السير وتوزع الأوردرات بأفضل كفاءة لتفادي زحام القاهرة.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card animate-slide-up delay-200" style={{ position: 'relative', zIndex: 1, padding: '3rem 2rem' }}>
            <div className="btn-primary" style={{ width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem' }}>03</div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '800' }}>شحن وتوسع</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
              شفافية كاملة في التتبع للعملاء، وتقارير دقيقة تساعدك تاخد قرارات توسع لشركتك في كل المحافظات.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ background: 'rgba(0,0,0,0.05)', padding: '4rem 0', borderY: '1px solid var(--border)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '0.2rem', marginBottom: '3rem', opacity: 0.8 }}>نفتخر بثقة رواد العمليات</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5rem', opacity: 0.5 }}>
             <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>LOGI-EGYPT</span>
             <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>CAIRO EXPRESS</span>
             <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>DELTA SHIP</span>
             <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>NILE TRUCKS</span>
          </div>
        </div>
      </section>

    </div>
  );
}
