import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        region:regions(*),
        origin_company:companies!origin_company_id(*),
        destination_company:companies!destination_company_id(*),
        order_items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });

    return new Response(JSON.stringify({ order: data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
