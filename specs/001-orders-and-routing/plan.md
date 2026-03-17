# Implementation Plan: Order Management & Smart Routing

## 1. Architectural Overview
This feature relies on the existing Supabase infrastructure, adhering to the project's Constitution. We will introduce CSV parsing on the frontend, sophisticated API routes for detailed order aggregation, and a matching algorithm for smart distribution.

## 2. Technical Stack
- **Frontend:** Next.js Server & Client Components (`src/app/orders/...`), `papaparse` or native JS CSV reading for batch upload.
- **Backend/API:** Next.js Route Handlers (`src/app/api/...`), Supabase Admin Client.
- **Database:** Existing Supabase tables (`orders`, `order_items`, `companies`, `regions`, `company_regions`).

## 3. Database Updates (Migrations)
No strict schema changes are strictly required as `orders` already has `region_id`, `origin_company_id`, and nullable `destination_company_id`.
However, we need an algorithmic component to rank companies. We will calculate the "score" dynamically based on the percentage of successfully delivered orders, or add a `score` INT column to `companies`.
- **Decision:** We will add a `rating` or `score` column to `companies` defaulting to 100 for simplicity initially.

## 4. API Endpoints
1. `POST /api/orders/batch`
   - Accepts an array of order objects.
   - Validates session to fetch `origin_company_id`.
   - Resolves smart identifiers (string `customer_id` / `region_id` -> UUID).
   - Inserts into `orders` and `order_items` returning the created records.
2. `GET /api/orders/[id]`
   - Fetches a single order's details by joining `order_items`, `customers`, and `regions`.
3. `GET /api/orders/available`
   - Driven by the destination company's session (`company_id`).
   - Looks up `company_regions` for the requesting company.
   - Fetches orders where `destination_company_id IS NULL`, `status='PENDING'`, and `region_id` matches the company's serviced regions.
   - Ordered by the company's score (if applicable) or creation date.
4. `POST /api/orders/accept`
   - Accepts `order_id`. Validates session.
   - Updates `orders SET destination_company_id = session_id, status = 'CONFIRMED'`.

## 5. Phase -1: Pre-Implementation Gates
#### Simplicity Gate (Article VII)
- [x] No overengineering; we are using direct Supabase queries locally, no external microservices.
#### Anti-Abstraction Gate (Article VIII)
- [x] Using raw Next.js App Router and Supabase JS Client without ORM wrappers (Prisma etc.) to avoid bloating.
#### Integration-First (Article IX)
- [x] All routes will be tested end-to-end with the existing mock companies from Phase 2.

## 6. Execution Strategy
We will implement the UI first for Batch Upload and Available Orders list, followed by the API routes, and then integrate them. The routing algorithm will be housed directly inside `GET /api/orders/available`.
