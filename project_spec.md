# 📄 Project Specification: منصة تبادُل (B2B Logistics)

## 🎯 المشروع باختصار
منصة B2B لتبادل الأوردرات بين شركات الشحن الصغيرة في مصر. الشركات بترفع الأوردرات، والمنصة بتوجهها أوتوماتيك لأقرب شركة بتغطي المنطقة باستخدام AI.

---

## 🏗️ الوضع الحالي (Status Quo)
لقد انتهينا من **Phase 1** (الواجهات) و **Phase 2** (ربط سوبابيس). 
- الأبليكيشن مربوط بـ **Supabase Auth & Database**.
- نظام التسجيل ودخول الشركات يعمل بشكل حقيقي (Real-time).
- الجداول الأساسية (13 جدول) تم إنشاؤها في سوبابيس.

---

## 🛠️ التقنيات (Tech Stack)
- **Frontend**: Next.js 15, React 19, Vanilla CSS.
- **Backend (Planned)**: Supabase (Auth, DB, Storage).
- **AI**: Claude API (for auto-routing).
- **Design**: Cairo Font, Glassmorphism, RTL.

---

## 📂 هيكل قاعدة البيانات (Supabase Schema)
- `companies`: بيانات الشركات + الأوراق + مناطق التغطية + الـ Score.
- `orders`: بيانات الأوردر + العميل + المنطقة + السعر + الشركة المصدرة/المستقبلة.
- `transactions`: المعاملات المالية + نظام الـ Freeze (48 ساعة).

---

## 💻 الكود اللي اتنفذ (Phase 1 Code)

### [src/app/globals.css](file:///D:/Loomark/tab-logistics/src/app/globals.css) (نظام التصميم)
```css
/* Cairo Font + RTL System + Glassmorphism */
:root {
  --primary: #0ea5e9;
  --primary-dark: #0284c7;
  --secondary: #10b981;
  --background: #0f172a;
}
html, body { direction: rtl; font-family: 'Cairo', sans-serif; background: var(--background); color: white; }
.glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
```

### [src/app/page.js](file:///D:/Loomark/tab-logistics/src/app/page.js) (Landing Page)
- واجهة احترافية فيها Hero Section و Features و Stats.

### Auth & Dashboard
- [src/app/auth/login/page.js](file:///D:/Loomark/tab-logistics/src/app/auth/login/page.js): تسجيل الدخول.
- [src/app/auth/register/page.js](file:///D:/Loomark/tab-logistics/src/app/auth/register/page.js): تسجيل شركة (اسم، تليفون، مناطق).
- [src/app/dashboard/page.js](file:///D:/Loomark/tab-logistics/src/app/dashboard/page.js): ملخص النشاط + أحدث الأوردرات.

---

## 🚀 المطلوب للمرحلة القادمة (Phase 3: إدارة الطلبات)
1. **صفحة إضافة أوردر (Add Order)**:
   - تصميم Premium بنظام الـ Glassmorphism.
   - حقول البيانات: (بيانات العميل، المنطقة، السعر، تفاصيل الشحنة).
   - الربط بـ API [src/app/api/orders/route.js](file:///D:/Loomark/tab-logistics/src/app/api/orders/route.js).
2. **صفحة قائمة الطلبات (Orders List)**:
   - عرض الطلبات الخاصة بالشركة الحالية فقط.
   - فلاتر للبحث بالحالة (قيد التنفيذ، تم التوصيل).
3. **تحديث الـ API**:
   - توفير Endpoint لجلب أحدث الطلبات للداشبورد.
   - توفير Endpoint لإضافة أوردر جديد وحفظه في جداول `orders` و `order_items`.
