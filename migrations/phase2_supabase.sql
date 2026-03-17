-- Phase 2 MVP: Supabase schema migrations
-- Prerequisites: enable 'pgcrypto' extension if not already enabled
-- This script creates tables and enums for the Supabase-backed MVP.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums for statuses
CREATE TYPE order_status AS ENUM ('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED');
CREATE TYPE shipment_status AS ENUM ('PENDING','IN_TRANSIT','DELIVERED','DELAYED','CANCELLED');

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Company documents (papers)
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  expiry DATE
);

-- Regions
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  name TEXT
);

-- Junction: company regions (which regions a company covers)
CREATE TABLE company_regions (
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, region_id)
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  origin_company_id UUID REFERENCES companies(id),
  destination_company_id UUID REFERENCES companies(id),
  region_id UUID REFERENCES regions(id),
  price NUMERIC(12,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  price NUMERIC(12,2) NOT NULL
);

-- Warehouses
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  capacity INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventories
CREATE TABLE inventories (
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  quantity INT DEFAULT 0,
  reserved INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (product_id, warehouse_id)
);

-- Carriers
CREATE TABLE carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE
);

-- Shipments
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  carrier_id UUID REFERENCES carriers(id),
  tracking_number TEXT,
  status shipment_status DEFAULT 'PENDING',
  origin_id UUID REFERENCES warehouses(id),
  destination_id UUID REFERENCES warehouses(id),
  eta TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL, -- CREDIT or DEBIT
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  settled_at TIMESTAMPTZ
);
