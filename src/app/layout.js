import { NotificationProvider } from '@/context/NotificationContext';
import Navbar from "@/components/Navbar";
import FooterWrapper from "@/components/FooterWrapper";
import "./globals.css";

export const metadata = {
  title: "منصة تاب لوجستيكس - شبكة تبادل الشحنات",
  description: "المنصة الأولى لربط شركات الشحن والتجار في مصر لتبادل الأوردرات وزيادة كفاءة التوصيل.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="industrial-grid">
        <NotificationProvider>
          <Navbar />
          {children}
          <FooterWrapper />
        </NotificationProvider>
      </body>
    </html>
  );
}
