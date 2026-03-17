'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  // Hide footer on dashboard and private pages to keep mobile UI clean
  const hideFooter = pathname.startsWith('/dashboard') || pathname.startsWith('/orders') || pathname === '/profile';
  
  if (hideFooter) return null;
  
  return <Footer />;
}
