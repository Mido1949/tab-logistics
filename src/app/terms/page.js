"use client";
import React from 'react';

export default function TermsPage() {
  const sections = [
    {
      title: "1. مقدمة",
      content: "أهلاً بك في منصة تاب لوجستيكس. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل البدء في استخدام خدماتنا."
    },
    {
      title: "2. وصف الخدمة",
      content: "تعمل تاب لوجستيكس كمنصة ذكية للربط بين شركات الشحن والتجار لتسهيل عملية تبادل الشحنات وإدارة العمليات اللوجستية بكفاءة عالية."
    },
    {
      title: "3. مسؤوليات المستخدم",
      content: "يتحمل المستخدم المسؤولية الكاملة عن صحة البيانات المدخلة في المنصة، بما في ذلك بيانات الشحنات، العناوين، ومعلومات التواصل. كما يتعهد بالحفاظ على سرية بيانات حسابه."
    },
    {
      title: "4. الرسوم والمدفوعات",
      content: "تخضع بعض الخدمات لرسوم اشتراك دورية كما هو موضح في صفحة الأسعار. تحتفظ المنصة بالحق في تعديل هذه الرسوم مع إشعار المستخدمين مسبقاً."
    },
    {
      title: "5. حدود المسؤولية",
      content: "نسعى لتقديم خدمة مستقرة وفعالة، ولكننا لا نتحمل المسؤولية عن أي خسائر غير مباشرة أو ناتجة عن سوء استخدام المنصة أو تعطل خدمات الطرف الثالث."
    },
    {
      title: "6. التعديلات",
      content: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يعتبر استمرارك في استخدام المنصة بعد إجراء التعديلات موافقة ضمنية عليها."
    }
  ];

  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <main className="container" style={{ padding: '8rem 1rem 6rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>قانوني</h2>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>الشروط والأحكام</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            تنظم هذه الوثيقة العلاقة بين منصة تاب لوجستيكس والمستخدمين لضمان بيئة عمل آمنة واحترافية للجميع.
          </p>
        </header>

        <div className="card glass animate-slide-up" style={{ padding: '4rem', border: '1px solid var(--border)', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {sections.map((section, index) => (
              <section key={index}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.2rem', color: 'var(--text)' }}>{section.title}</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', fontWeight: '500' }}>
                  {section.content}
                </p>
              </section>
            ))}
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
