import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function GET(req) {
  try {
    // Fetch orders that DON'T have a destination company (unclaimed)
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        origin_company:companies!origin_company_id(name),
        region:regions(name),
        order_items(count)
      `)
      .is('destination_company_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify({ orders: data ?? [] }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
