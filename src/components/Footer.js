"use client";
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'من نحن', href: '/about' },
      { name: 'باقات الاشتراك', href: '/pricing' },
      { name: 'اتصل بنا', href: '/contact' },
    ],
    legal: [
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'الشروط والأحكام', href: '/terms' },
    ],
    social: [
      { name: 'facebook', icon: 'facebook', href: '#' },
      { name: 'linkedin', icon: 'description', href: '#' },
      { name: 'instagram', icon: 'photo_camera', href: '#' },
      { name: 'twitter', icon: 'brand_family', href: '#' },
    ]
  };

  return (
    <footer style={{ 
      background: 'var(--background)', 
      borderTop: '2px solid var(--border)', 
      padding: '4rem 1rem 2rem', 
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '3rem', 
          marginBottom: '3rem' 
        }}>
          {/* Brand Brief */}
          <div style={{ maxWidth: '300px' }}>
            <Logo width={45} height={45} showText={true} />
            <p style={{ 
              marginTop: '1.5rem', 
              color: 'var(--text-muted)', 
              lineHeight: '1.7',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              الأوركسترا اللوجستية الأولى في مصر. نهدف لتمكين شركات الشحن والتجار من خلال التنسيق الذكي والكفاءة الرقمية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.1rem' }}>الشركة</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link href={link.href} style={{ color: 'var(--text-muted)', fontWeight: '600', transition: 'color 0.2s' }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.1rem' }}>قانوني</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {footerLinks.legal.map(link => (
                <li key={link.name}>
                  <Link href={link.href} style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.1rem' }}>تابعنا</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              {footerLinks.social.map(social => (
                <a key={social.name} href={social.href} className="glass" style={{ 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '10px',
                  color: 'var(--primary)',
                  border: '1px solid var(--border)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>{social.icon}</span>
                </a>
              ))}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
              القاهرة، المعادي، مصر<br />
              support@tab-logistics.com
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: '2rem', 
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          fontWeight: '700'
        }}>
          © {currentYear} تاب لوجستيكس. صُمم للشركات المصرية الطموحة.
          <br />
          <span style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem', display: 'block' }}>Powered by LOOMARK</span>
        </div>
      </div>
    </footer>
  );
}
