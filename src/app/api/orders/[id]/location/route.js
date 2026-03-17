import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { lat, lng } = await req.json();

    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: 'Latitude and Longitude are required' }), { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        current_lat: lat,
        current_lng: lng,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
