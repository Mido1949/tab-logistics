"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout, getCompanyId } from '@/lib/session';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const isPublicPage = ['/', '/about', '/pricing', '/privacy', '/terms', '/contact', '/auth/login', '/auth/register'].includes(pathname);
  
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tab_lang') || 'ar';
    }
    return 'ar';
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tab_theme') || 'light';
    }
    return 'light';
  });
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const cid = getCompanyId();
    if (cid) {
      fetch(`/api/companies/info?id=${cid}`)
        .then(res => res.json())
        .then(data => {
          if (data.company?.verification_status === 'VERIFIED') setIsVerified(true);
        })
        .catch(err => console.error('Navbar verification check failed', err));
    }

    // 1. Language logic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('tab_lang', lang);
    
    // 2. Theme logic
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tab_theme', theme);
  }, [lang, theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const navItems = {
    ar: { 
      home: 'الرئيسية', 
      about: 'من نحن', 
      pricing: 'الباقات', 
      dashboard: 'لوحة التحكم', 
      wallet: 'المحفظة', 
      profile: 'الملف', 
      login: 'دخول', 
      register: 'اشترك', 
      logout: 'تسجيل خروج',
      switch: 'EN' 
    },
    en: { 
      home: 'Home', 
      about: 'About', 
      pricing: 'Pricing', 
      dashboard: 'Dashboard', 
      wallet: 'Wallet', 
      profile: 'Profile', 
      login: 'Login', 
      register: 'Sign Up', 
      logout: 'Logout',
      switch: 'عربي' 
    }
  };

  const t = navItems[lang];

  return (
    <>
      <nav className={`nav-container ${isPublicPage ? 'navbar-website' : 'navbar-app'}`}>
        <div className="nav-inner flex justify-between items-center">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1001 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Logo width={45} height={45} showText={true} />
              {isVerified && (
                <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 'bold' }} title="حساب موثق">verified</span>
              )}
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="theme-toggle"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Navigation">
              {isOpen ? <span className="material-symbols-outlined">close</span> : <span className="material-symbols-outlined">menu</span>}
            </button>
          </div>

          {/* Navigation Links (Desktop & Mobile Drawer) */}
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <button className="close-mobile-btn md:hidden" onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined">close</span>
              إغلاق
            </button>

            {/* Links for Public Website only */}
            {isPublicPage && (
              <>
                <Link href="/about" onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>{t.about}</Link>
                <Link href="/pricing" onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>{t.pricing}</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>تواصل معنا</Link>
              </>
            )}
            
            {/* Internal App Navigation */}
            {!isPublicPage && (
              <div className="flex flex-col w-full">
                <div className="drawer-divider"></div>
                <div className="drawer-section-title">لوحة التحكم</div>
                
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className={`mobile-drawer-link ${pathname === '/dashboard' ? 'active' : ''}`}>
                  <span className="material-symbols-outlined">dashboard</span>
                  الرئيسية
                </Link>
                
                <Link href="/orders/available" onClick={() => setIsOpen(false)} className={`mobile-drawer-link ${pathname === '/orders/available' ? 'active' : ''}`}>
                  <span className="material-symbols-outlined">local_shipping</span>
                  سوق الشحنات
                </Link>
                
                <Link href="/dashboard/finance" onClick={() => setIsOpen(false)} className={`mobile-drawer-link ${pathname === '/dashboard/finance' ? 'active' : ''}`}>
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  المعاملات المالية
                </Link>

                <div className="drawer-divider"></div>
                <div className="drawer-section-title">الحساب</div>
                <Link href="/dashboard/verification" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
                   <span className="material-symbols-outlined">verified_user</span>
                   التوثيق
                </Link>

                <div className="drawer-divider"></div>
                <button className="btn btn-secondary w-full" onClick={logout} style={{ marginTop: '1rem' }}>
                  <span className="material-symbols-outlined">logout</span>
                  {t.logout}
                </button>
              </div>
            )}

            {/* Language Switchers (Always at bottom of drawer if mobile) */}
            <div className="md:hidden drawer-divider"></div>
            <button 
              onClick={() => { setLang(lang === 'ar' ? 'en' : 'ar'); setIsOpen(false); }} 
              className="btn btn-secondary" 
              style={{ border: '1px solid var(--border)', padding: '0.4rem 0.8rem', width: 'auto' }}
            >
              <span className="material-symbols-outlined">language</span> {t.switch}
            </button>

            {isPublicPage && (
              <div className="md:hidden flex flex-col gap-4 w-full mt-4">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <button className="btn btn-secondary w-full">{t.login}</button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  <button className="btn btn-primary w-full">{t.register}</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modern Mobile Bottom Navigation - ONLY on private pages */}
      {!isPublicPage && (
        <div className="bottom-nav md:hidden">
          <Link href="/dashboard" className={`bottom-nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>{t.dashboard}</span>
          </Link>
          <Link href="/orders/list" className={`bottom-nav-item ${pathname.includes('/orders') ? 'active' : ''}`}>
            <span className="material-symbols-outlined">local_shipping</span>
            <span>الشحنات</span>
          </Link>
          <Link href="/dashboard/settings" className={`bottom-nav-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}>
            <span className="material-symbols-outlined">person</span>
            <span>{t.profile}</span>
          </Link>
        </div>
      )}

      {/* Overlay for mobile */}
      <div 
        className={`nav-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
}
