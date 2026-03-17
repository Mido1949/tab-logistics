# Specification: Order Management & Smart Routing (Phases 3 & 4)

## What We Are Building
This feature set finalizes constraints of **Phase 3** (Order System) and fully introduces **Phase 4** (Sorting & Routing).
1. **Batch Upload:** Allow origin companies to upload an Excel/CSV file containing multiple orders to create them in bulk instead of inserting them one by one.
2. **Order Detail Page:** A distinct page that displays all details for a specific order (`orders/[id]`), including its items and current status.
3. **Automatic Region Filtering:** When an order is created with a specific `region_id` and left without a `destination_company_id`, the system should figure out which available transportation companies cover that region.
4. **Sorting Algorithm:** Orders available for assignment are broadcasted/shown to companies. Companies are scored based on previous successful deliveries. The system prioritizes assigning orders to companies with higher scores in that distinct region.
5. **Accept/Reject Mechanism:** A company can review incoming orders routed to them and click "Accept" or "Reject".
6. **Notification System:** Companies are notified when a new order is routed to their dispatch queue.

## Why We Are Building It
- Manual order entry is a bottleneck; bulk uploads enable scale.
- Origin companies need detailed insights for each created shipment.
- The platform needs an intelligent routing capability (the core B2B value proposition) to connect unassigned orders from origin companies to the most capable/fitting delivery companies dynamically.

## User Stories
1. **As an origin company**, I can upload a CSV file with 50+ orders so they are rapidly ingested into the system.
2. **As an origin company**, I can click on a specific order from my Orders List to view its full details (items, routing status, price).
3. **As a destination company**, I see a dedicated "Available Orders" queue containing orders directed to regions I service.
4. **As the system**, I automatically calculate a company's success score and recommend orders to high-scoring companies first.
5. **As a destination company**, I can view detailed metrics of an available order and push "Accept" to take responsibility for it, transitioning its status to "Confirmed/In Transit".

## Acceptance Criteria
- [ ] CSV Upload interface successfully reads and inserts batches into `orders` and `order_items`.
- [ ] Navigation to `/orders/[id]` accurately fetches and renders a single order's data.
- [ ] A backend logic function reliably returns a list of destination companies filtered by `company_regions` and ordered by `score/rating`.
- [ ] "Available Orders" tab reliably lists "PENDING" orders with no destination company assigned, filtering specifically for the viewing company's serviced regions.
- [ ] Accepting an order updates `destination_company_id` and changes the status to "CONFIRMED".
