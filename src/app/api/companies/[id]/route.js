import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { data: company, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return new Response(JSON.stringify({ company }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
