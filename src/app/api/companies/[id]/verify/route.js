import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { tax_id_doc_url, commercial_registry_doc_url } = body;

    if (!id) return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('companies')
      .update({
        tax_id_doc_url,
        commercial_registry_doc_url,
        verification_status: 'PENDING'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, company: data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
