import { supabaseAdmin } from '@/supabase/supabaseClient';

// API route: register a new company and user via Supabase Auth and DB
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, companyName } = body;
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 1) Create user in Auth
    const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY
      },
      body: JSON.stringify({ email, password })
    });
    const signupData = await signupRes.json();

    // 2) Create company record
    const companyRes = await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ name: companyName, contact_email: email })
    });
    const companyData = await companyRes.json();

    const company_id = companyData?.[0]?.id;

    return new Response(JSON.stringify({ 
      user: signupData, 
      company: companyData?.[0] || companyData,
      company_id: company_id 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e && e.message) || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
