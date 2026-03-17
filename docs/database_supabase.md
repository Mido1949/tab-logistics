# Supabase MVP Schema (Phase 2)

هذا المستند يوضح مخطط قاعدة البيانات المقترح لمرحلة Phase 2 باستخدام Supabase كحل متكامل (Auth, DB, Storage).

## الجداول الأساسية
- companies
- papers
- regions
- company_regions (جدول تقاطعي لربط الشركات بالمناطق)
- customers
- orders
- order_items
- products
- warehouses
- inventories
- carriers
- shipments
- transactions

## المخطط المفصل (DDL - PostgreSQL)
```sql
-- الشركات
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- المستندات المرتبطة بالشركات
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  expiry DATE
);

-- المناطق
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  name TEXT
);

-- ربط الشركات بالمناطق
CREATE TABLE company_regions (
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, region_id)
);

-- العملاء
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- المنتجات
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL
);

-- الأوردرات
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  origin_company_id UUID REFERENCES companies(id),
  destination_company_id UUID REFERENCES companies(id),
  region_id UUID REFERENCES regions(id),
  price NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- عناصر الطلب
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  price NUMERIC(12,2) NOT NULL
);

-- المخازن
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  capacity INT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- المخزون
CREATE TABLE inventories (
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  quantity INT DEFAULT 0,
  reserved INT DEFAULT 0,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (product_id, warehouse_id)
);

-- الناقلون
CREATE TABLE carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE
);

-- الشحنات
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  carrier_id UUID REFERENCES carriers(id),
  tracking_number TEXT,
  status TEXT DEFAULT 'PENDING',
  origin_id UUID REFERENCES warehouses(id),
  destination_id UUID REFERENCES warehouses(id),
  eta TIMESTAMP WITHOUT TIME ZONE,
  actual_delivery TIMESTAMP WITHOUT TIME ZONE
);

-- المعاملات
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL, -- CREDIT or DEBIT
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  settled_at TIMESTAMP WITHOUT TIME ZONE
);
```

## ملاحظات التنفيذ
- استخدم RLS للتحكم في الوصول حسب دور المستخدم.
- استخدم migrations/SQL scripts عبر Supabase لتحديث المخطط بشكل سلسلة وآمنة.
- اضبط تعيينات التخزين (Storage) لرفع المستندات المرتبطة بالشركات.
