import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('company_id');

    if (!companyId) {
      return new Response(JSON.stringify({ error: 'Company ID is required' }), { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return new Response(JSON.stringify({ notifications: data ?? [] }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
