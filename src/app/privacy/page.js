export default function PrivacyPolicyPage() {
  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <main className="container" style={{ padding: '8rem 1rem 6rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>الخصوصية</h2>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>سياسة الخصوصية واستخدام البيانات</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            نحن نلتزم بحماية بياناتك وضمان أعلى مستويات الأمان والشفافية في منصة تاب لوجستيكس.
          </p>
        </header>

        <div className="card glass animate-slide-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', color: 'var(--text)' }}>
            <section>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.2rem' }}>1. جمع المعلومات</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: '500' }}>
                في منصة &quot;تاب&quot;، نقوم بجمع المعلومات الضرورية فقط لتسهيل عمليات التبادل بين الشركات. يشمل ذلك: بيانات الشركة (الاسم، البريد، الهاتف)، بيانات التوثيق (OTP و Google)، والموقع الجغرافي (Geolocation API) لضمان دقة العمل والمنافسة العادلة. موقعك يُستخدم حصرياً لعرض الطلبات القريبة منك ولأغراض الأمان ولن يُشارك مع جهات خارجية.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.2rem' }}>2. استخدام البيانات</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: '500' }}>
                نستخدم بياناتك لتشغيل وتوفير خدماتنا مثل إظهار الأوردرات المتاحة وتسهيل عملية قبولها. كما تُستخدم معلومات العمل والتقييمات المتراكمة لتطبيق &quot;سياسة النقاط&quot; التي تضمن شفافية المنافسة وتُبرز الشركات الملتزمة والموثوقة على المنصة.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.2rem' }}>3. المشاركة والشفافية</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: '500' }}>
                تعتمد عقيدتنا على الشفافية؛ لذا قد يتم مشاركة بعض البيانات الأساسية مع شركات الشحن الأخرى (مثل اسمك، تقييمك، ومنطقة تواجدك) فقط أثناء تبادل أوردر، وذلك لضمان الموثوقية واستقرار سير التسليم.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.2rem' }}>4. حماية البيانات والمعاملات المالية</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: '500' }}>
                نحن نحافظ على سرية بياناتك المالية. تخضع المعاملات والاشتراكات لبروتوكولات التشفير القياسية المعتمدة ولا يتم تخزين تفاصيل بطاقات الدفع بشكل مباشر على خوادمنا بل من خلال مزودي خدمات الدفع الآمنين.
              </p>
            </section>
          </div>

          <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600' }}>
              آخر تحديث: 16 مارس 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
