# Constitution: Tab-Logistics Project

## Core Principles
1. **Supabase-Only Backend:** The system relies exclusively on Supabase for database, authentication, and file storage. Avoid creating parallel custom backend servers or utilizing alternative databases.
2. **Glassmorphism & Premium UI:** The interface must maintain a modern, premium aesthetic (glassmorphism, clean layouts, vibrant colors on dark backgrounds) consistent with the initial phases.
3. **Session-Based State:** Users are tied to a `company_id` via secure cookies/sessions. The frontend should automatically populate origins and user references using this session, without prompting the user.
4. **Smart Identifiers (Graceful Degradation):** Whenever a UUID is expected (e.g., `company_id`, `customer_id`, `region_id`), the API must gracefully attempt to resolve string-based names to UUIDs via database lookups or inserts to ensure seamless user experience.
5. **Separation of Concerns:** Keep API Route logic (`src/app/api`) focused strictly on Request/Response handling. Complex business logic (Routing, Scoring algorithms) should be isolated in utility functions/services.
6. **Code Clarity over Cleverness:** Write readable, scalable code. Avoid over-engineering.

## Quality Standards
- **Component Reusability:** Favor reusable React components (`src/components/...`) over repeating UI code.
- **Client/Server distinction:** Use `"use client"` appropriately and sparingly, pushing heavy lifting to Server Components or API Routes.
- **Error Handling:** All form submissions and API calls must have user-friendly error messages (e.g., toast notifications or inline alerts).
