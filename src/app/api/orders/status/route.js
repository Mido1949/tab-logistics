import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function POST(req) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: 'Order ID and Status are required' }), { status: 400 });
    }

    // 1) Get current order to find companies involved
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('origin_company_id, destination_company_id')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) throw new Error('Order not found');

    // 2) Update status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // 3) Notify companies
    // Notify origin company about any change
    await supabaseAdmin.from('notifications').insert({
      company_id: order.origin_company_id,
      title: 'تحديث حالة الشحنة',
      message: `تم تغيير حالة الشحنة #${orderId.slice(0,8)} إلى: ${status}`,
      type: 'STATUS_CHANGE',
      reference_id: orderId
    });

    // Notify destination company if it exists
    if (order.destination_company_id) {
      await supabaseAdmin.from('notifications').insert({
        company_id: order.destination_company_id,
        title: 'تحديث الحالة',
        message: `قمت بتحديث حالة الشحنة #${orderId.slice(0,8)} إلى: ${status}`,
        type: 'STATUS_CHANGE',
        reference_id: orderId
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
