import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function POST(req) {
  try {
    const { orderId, companyId } = await req.json();

    if (!orderId || !companyId) {
      return new Response(JSON.stringify({ error: 'Order ID and Company ID are required' }), { status: 400 });
    }

    // 1) Verify the order is still unclaimed
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, origin_company_id, destination_company_id')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }

    if (order.destination_company_id) {
      return new Response(JSON.stringify({ error: 'Order has already been accepted' }), { status: 400 });
    }

    if (order.origin_company_id === companyId) {
      return new Response(JSON.stringify({ error: 'You cannot accept your own order' }), { status: 400 });
    }

    // 2) Update the order to set the destination_company_id (claim it)
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        destination_company_id: companyId,
        status: 'CONFIRMED' 
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // 3) Create a notification for the origin company
    await supabaseAdmin.from('notifications').insert({
      company_id: order.origin_company_id,
      title: 'تم قبول شحنتك',
      message: `قام أحد الشركاء بقبول شحنتك #${orderId.slice(0,8)}، جاري التنسيق للتسليم.`,
      type: 'ORDER_ACCEPTED',
      reference_id: orderId
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
