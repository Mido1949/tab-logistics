import { supabaseAdmin } from '@/supabase/supabaseClient';

export async function GET(req) {
  try {
    const { data: regions, error } = await supabaseAdmin
      .from('regions')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return new Response(JSON.stringify({ regions: regions ?? [] }), { 
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
