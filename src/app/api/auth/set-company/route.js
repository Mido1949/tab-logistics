'use server';

// API endpoint to set the company_id cookie on the client session for E2E testing and session management
export async function POST(req) {
  try {
    const body = await req.json();
    const { company_id, max_age_seconds } = body;
    if (!company_id) {
      return new Response(JSON.stringify({ error: 'company_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const maxAge = typeof max_age_seconds === 'number' ? max_age_seconds : 60 * 60 * 24 * 7; // 1 week by default
    const cookie = `company_id=${encodeURIComponent(company_id)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e && e.message) || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
