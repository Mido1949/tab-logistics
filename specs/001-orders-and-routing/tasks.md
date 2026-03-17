# Task Breakdown: Order Management & Routing

## Phase A: Batch Excel/CSV Upload
- [x] Create `src/app/orders/batch/page.js` UI for file drop/upload.
- [x] Implement CSV parsing logic on the client-side to convert rows to JSON objects.
- [x] Create `POST /api/orders/batch` endpoint to receive JSON array and insert iteratively/batch using Supabase `insert()`.
- [x] Resolve names/strings to UUIDs within the batch handler.

## Phase B: Detail Page
- [x] Create `src/app/orders/[id]/page.js` Server Component to fetch and display isolated order data + items.
- [x] Update `OrdersList` cards to link to this detail page.

## Phase C: Smart Routing & Available Orders Queue
- [x] Create `src/app/orders/available/page.js` specific for destination/delivery companies.
- [x] Create `GET /api/orders/available` endpoint.
  - Query 1: Get regions serviced by the user's `company_id`.
  - Query 2: Fetch unassigned orders (`destination_company_id IS NULL`) in those regions.
- [x] Create `POST /api/orders/accept` to claim an order (update DB).
- [x] Wire the "Accept Order" button in the Available Orders UI to the accept endpoint.

## Parallelization
- [P] Phase A and Phase B can be done independently. Phase C relies on unassigned orders exiting Phase A or Add Order page.
