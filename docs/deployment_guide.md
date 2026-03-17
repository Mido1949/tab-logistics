# 🚀 Tab Logistics Deployment Guide (Phase 10)

This guide provides everything you need to take your logistics platform live.

## 1. Environment Variables (`.env`)
Ensure these are set in your hosting provider (Vercel, Cloud Run, etc.):

| Key | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for frontend calls. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Private** key for admin actions (Finance/Internal). |
| `BASE_URL` | Your production domain (e.g., `https://tab-logistics.com`). |

---

## 2. Supabase SQL & Security
You have already applied the migrations. Ensure the following:
1.  **pg_cron**: Verify `pg_cron` is enabled in Extensions.
2.  **Cron Task**: Schedule the automated release engine:
    ```sql
    SELECT cron.schedule('release-funds-every-15m', '*/15 * * * *', 'SELECT release_frozen_funds();');
    ```
3.  **RLS (Row Level Security)**: Turn on RLS for all tables and ensure policies allow reading Public data but only Admin/Owner writes.

---

## 3. Deployment Options

### Option A: Vercel (Recommended)
1.  Connect your GitHub repository to Vercel.
2.  Add the Environment Variables listed above.
3.  Vercel will automatically detect Next.js and deploy.

### Option B: Google Cloud Run (Docker)
1.  Build the image: `docker build -t tab-logistics .`
2.  Push to Artifact Registry.
3.  Deploy to Cloud Run with the `.env` variables injected.

---

## 4. Final Verification Checklist
- [ ] Login/Register works on production URL.
- [ ] 48h Commission logic creates a `PENDING` record.
- [ ] Document upload in Settings successfully puts status to `PENDING`.
- [ ] Dashboard displays $0 balances correctly for new accounts.

---

**Tab Logistics is now production-ready!**
🎉
