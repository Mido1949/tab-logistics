import { supabaseAdmin } from '@/supabase/supabaseClient';

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = decodeURIComponent(parts.slice(1).join('='));
      list[key] = val;
    }
  });
  return list;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('company_id') || (() => {
      const cookies = parseCookies(req.headers.get('cookie'));
      return cookies['company_id'];
    })();
    if (!companyId) {
      return new Response(JSON.stringify({ error: 'company_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const { data: company } = await supabaseAdmin.from('companies').select('balance, frozen_balance').eq('id', companyId).single();
    const { data: txs } = await supabaseAdmin.from('transactions').select('*').eq('company_id', companyId).order('created_at', { ascending: false });
    return new Response(JSON.stringify({ 
      availableBalance: company?.balance || 0, 
      frozenBalance: company?.frozen_balance || 0, 
      transactions: txs ?? [] 
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { company_id, order_id, amount, type, description } = body;
    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const compId = company_id || cookies['company_id'];
    if (!compId) {
      return new Response(JSON.stringify({ error: 'company_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const { data, error } = await supabaseAdmin.from('transactions').insert({ company_id: compId, order_id, amount, type, description }).select('*');
    if (error) throw error;
    return new Response(JSON.stringify({ transaction: data?.[0] }), {
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
