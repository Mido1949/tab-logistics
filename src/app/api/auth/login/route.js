import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 1) Login to Auth
    const tokenRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY
      },
      body: JSON.stringify({ email, password })
    });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
        // The original code threw an error here.
        // We will now return a response directly with the token error details.
        const tokenError = {
            message: tokenData.error_description || tokenData.error || 'فشل تسجيل الدخول',
            details: tokenData
        };
        console.error('Supabase Auth Error:', tokenError.message);
        return new Response(JSON.stringify({ error: tokenError.message, details: tokenError.details }), { status: 401 });
    }


    // 2) Fetch company details for this email (with flexibility)
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('id, name')
      .ilike('contact_email', email)
      .maybeSingle();


    if (companyError) {
      console.warn('Non-fatal Company Lookup Error:', companyError);
    }

    const responseData = { 
      token: tokenData, 
      company_id: companyData?.id || null,
      company_name: companyData?.name || null,
      success: true
    };
    
    console.log('Login Success:', email, companyData?.name);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Fatal Login Error:', err.message);
    return new Response(JSON.stringify({ error: err.message || 'فشل تسجيل الدخول' }), { 
      status: 400, // Client error is usually 400
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
