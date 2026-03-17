import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('id');

    if (!companyId) {
      return new Response(JSON.stringify({ error: 'Company ID is required' }), { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('verification_status, commercial_registry_url, tax_card_url, national_id_url')
      .eq('id', companyId)
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ company: data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
