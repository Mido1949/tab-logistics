# Phase 2 - Supabase MVP Plan (Option A)

هدف Phase 2: بناء قاعدة بيانات كاملة باستخدام Supabase تشمل Auth, DB و Storage لسرعة MVP وتسهيلات الإدارة.

- ما سنقدمه (Scope):
- هيكل بيانات موثوق وموسّع يغطي الشركات، الطلبات، العملاء، المخزون، والمدفوعات.
- واجهات تسجيل دخول وتسجيل حساب مرتبطة بقاعدة البيانات.
- صفحة إضافة أوردر جديد وربطها بقاعدة البيانات وخزن المستندات (سجل تجاري/بطاقة ضريبية) في Storage.
- ربط Frontend بـ Supabase عبر client-side وserver-side حيث الحاجة.
- API routes مبنية مع Next.js لعمليات الإنشاء والقراءة والتحديث في Supabase.

- هيكل الجداول المقترح (Supabase) (مفصل):
## الجداول المقترحة
- companies
- papers
- regions
- company_regions
- customers
- orders
- order_items
- products
- warehouses
- inventories
- carriers
- shipments
- transactions
- enums: order_status, shipment_status

- العلاقات الأساسية
- شركة تمتلك أوردرات وتربط بمنطق المناطق وتخزن أوراق.
- order_items ترتبط بـ orders و products
- shipment مرتبط بـ order و carrier ومخازن origin/destination
- transactions مرتبطة بـ order
- papers مرتبطة بـ company

- خطوات التنفيذ (MVP):
- إعداد Supabase Project وتفعيل Auth و DB و Storage
- تنفيذ SQL migrations المذكورة أدناه
- تمكين أمان Row Level Security (RLS)
- بناء API routes لـ auth/ orders ويعرض القوائم في Dashboard
- دمج Storage لرفع المستندات

- خطوات تطبيق (SQL/Migrations):
- استخدم ملف migrations/phase2_supabase.sql للمخطط الكامل
- يمكن أيضاً تشغيل SQL في SQL Editor في Supabase

- كيفية التشغيل والربط
- إعداد .env كما هو موضح في الملف .env.example
- استيراد القاعدة عبر Supabase
- تشغيل Next.js frontend مع المتغيرات البيئية الصحيحة

- ملاحظات أمان
- استخدم Service Role Key من الخادم فقط للعمليات الإدارية
- استخدم anon key في الواجهة الأمامية للعمليات العادية

- مخرجات MVP:
- قاعدة بيانات جاهزة في Supabase مع Auth/Storage
- صفحات تسجيل وتسجيل دخول
- صفحة Add Order وربطها بالـ DB
- لوحة قيادة تعرض الطلبات

- خطة العمل القادمة
- تحسين UI/UX وتوثيق أكثر
- إضافة فلاتر وخطط لإدارة المخزون

- هيكل بيانات موثوق وموسّع يغطي الشركات، الطلبات، العملاء، المخزون، والمدفوعات.
- واجهات تسجيل دخول وتسجيل حساب مرتبطة بقاعدة البيانات.
- صفحة إضافة أوردر جديد وربطها بقاعدة البيانات وخزن المستندات (سجل تجاري/بطاقة ضريبية) في Storage.
- ربط Frontend بـ Supabase عبر client-side وserver-side حيث الحاجة.

هيكل الجداول المقترح (Supabase)
- الشركات (companies)
- المستندات (papers) - المستندات المرافقة للشركات
- المناطق/التغطية (regions, company_regions)
- العملاء (customers)
- الأوردرات (orders)
- عناصر الطلب (order_items)
- المنتجات (products)
- المخازن (warehouses)
- المخزون (inventories)
- الشحنات (shipments)
- الناقلين (carriers)
- المعاملات (transactions)
- حالة الطلب/الشحن (order_status, shipment_status) as enums

نماذج العلاقات الأساسية
- أحد الشركة يملك عدة أوردرات وتعبئة مخازن عبر junction tables مثل company_regions.
- Order يرتبط ب Customer و Origin/Destination Company و Region.
- OrderItem يرتبط بكل Order وبـ Product.
- Shipment مرتبط بـ Order و Carrier ويحتوي origin/destination كـ Warehouse.
- Paper مرتبط بـ Company ويخزن مسار المستند في Storage.
- Transaction مرتبط بـ Order ويخزن المبلغ ونوع العملية والتوقيت.

خطوات الإعداد (MVP)

ملفات مهمة في هذا المسار
- docs/database_supabase.md: تعريف تفصيلي للـ schema و DDL للجدوال.
- supabase/supabaseClient.ts: تهيئة عميل Supabase في التطبيق.
- src/app/api/auth/register/route.js: نقطة API لإنشاء مستخدم/شركة (مثال بنية MVP).
- src/app/api/auth/login/route.js: نقطة API لتسجيل الدخول.
- src/app/orders/add/page.js: واجهة إضافة أوردر وربطها بالقاعدة.

أمثلة سريعة على النطاقات والاختبارات القادمة
- POST /api/auth/register: يستقبل بيانات الشركة والمستخدم ويفتح حساب Supabase Auth.
- POST /api/orders: يقبل تفاصيل الطلب ويخزّن الطلب وعناصره.
- GET /api/dashboard: يعرض ملخص النشاط والطلبات الأخيرة.

ملاحظات مهمة
- سنعتمد على NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في الواجهة الأمامية، وعلى SUPABASE_SERVICE_ROLE_KEY في الخادم عند الحاجة للمهام الإدارية.
- يمكن اضافة سياسة الوصول (Row Level Security) حسب دور المستخدم (owner, staff, customer).

خطة التقدم التالية
